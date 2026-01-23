import { Scene, PointerEventTypes, Vector3 } from 'babylonjs';
import { Character, Coordinates, ILogger } from '@voidbound/domain';
import { PlayerMovementController } from '../PlayerMovementController';

// Мокаем Babylon.js так как мы в Node среде
jest.mock('babylonjs', () => {
  return {
    PointerEventTypes: {
      POINTERDOWN: 0,
      POINTERUP: 1
    },
    Vector3: class {
      constructor(public x: number, public y: number, public z: number) {}
      static Zero() { return new Vector3(0, 0, 0); }
      add(other: { x: number, y: number, z: number }) { return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z); }
      scale(s: number) { return new Vector3(this.x * s, this.y * s, this.z * s); }
    },
    Plane: {
      FromPositionAndNormal: jest.fn().mockReturnValue({})
    },
    Ray: jest.fn().mockImplementation(() => ({
      intersectsPlane: jest.fn(),
      origin: new Vector3(0, 10, 0),
      direction: new Vector3(0, -1, 0)
    }))
  };
});

describe('PlayerMovementController', () => {
  let sceneMock: {
    onPointerObservable: {
      add: jest.Mock;
    };
    createPickingRay: jest.Mock;
    pointerX: number;
    pointerY: number;
  };
  let characterMock: Character;
  let loggerMock: ILogger;
  let controller: PlayerMovementController;
  let pointerObservableCallback: (pointerInfo: { type: number; event: { button: number } }) => void;

  beforeEach(() => {
    // Подготовка мока логгера
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    // Подготовка мока луча
    const rayMock = {
      intersectsPlane: jest.fn().mockReturnValue(10), // 10 единиц до пересечения
      origin: new Vector3(0, 10, 0),
      direction: new Vector3(1, -1, 2) // Допустим, такое направление
    };

    // Подготовка мока сцены
    sceneMock = {
      onPointerObservable: {
        add: jest.fn((callback: (pointerInfo: { type: number; event: { button: number } }) => void) => {
          pointerObservableCallback = callback;
        })
      },
      createPickingRay: jest.fn().mockReturnValue(rayMock),
      pointerX: 100,
      pointerY: 200
    };

    // Подготовка мока персонажа
    characterMock = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    jest.spyOn(characterMock, 'setDestination');
    jest.spyOn(characterMock, 'setPath');
    jest.spyOn(characterMock, 'moveTo');

    controller = new PlayerMovementController(
      sceneMock as unknown as Scene, 
      characterMock, 
      loggerMock
    );
  });

  it('должен подписываться на события указателя при инициализации', () => {
    expect(sceneMock.onPointerObservable.add).toHaveBeenCalled();
  });

  it('должен устанавливать путь или цель при клике на основе пересечения с плоскостью', () => {
    // Вызываем колбэк события клика
    pointerObservableCallback({
      type: PointerEventTypes.POINTERDOWN,
      event: { button: 0 } // Левая кнопка мыши
    });

    // Проверяем, что установлен либо путь, либо цель напрямую
    const wasSet = (characterMock.setDestination as jest.Mock).mock.calls.length > 0 || 
                   (characterMock.setPath as jest.Mock).mock.calls.length > 0;
    
    expect(wasSet).toBe(true);
    
    // Проверяем вызовы логгера
    expect(loggerMock.debug).toHaveBeenCalledWith(expect.stringContaining('Клик зафиксирован'));
    expect(loggerMock.info).toHaveBeenCalledWith(expect.stringContaining('Установлена новая цель'));
  });

  it('должен вызывать moveTo при обновлении, если цель установлена', () => {
    const target = new Coordinates(5, 5);
    characterMock.setDestination(target);
    
    controller.update(0.1);

    expect(characterMock.moveTo).toHaveBeenCalledWith(target, 0.1);
  });

  it('должен логировать достижение цели', () => {
    const target = new Coordinates(0.001, 0.001); // Очень близко к текущей позиции (0,0)
    characterMock.setDestination(target);
    
    controller.update(0.1);

    expect(loggerMock.info).toHaveBeenCalledWith('Цель достигнута');
    expect(characterMock.setDestination).toHaveBeenCalledWith(null);
  });

  it('не должен вызывать moveTo при обновлении, если цели нет', () => {
    characterMock.setDestination(null);
    
    controller.update(0.1);

    expect(characterMock.moveTo).not.toHaveBeenCalled();
  });

  it('должен продолжать обновлять цель в методе update, если кнопка мыши зажата', () => {
    // 1. Нажимаем кнопку
    pointerObservableCallback({
      type: PointerEventTypes.POINTERDOWN,
      event: { button: 0 }
    });

    // Очищаем мок, чтобы проверить новые вызовы
    jest.clearAllMocks();

    // 2. Меняем положение курсора в моке сцены
    sceneMock.pointerX = 500;
    sceneMock.pointerY = 600;

    // 3. Вызываем update
    controller.update(0.1);

    // Должен был быть вызван Raycasting и установка новой цели
    expect(sceneMock.createPickingRay).toHaveBeenCalled();
    expect(characterMock.setDestination).toHaveBeenCalledWith(expect.any(Coordinates));
  });

  it('должен перестать обновлять цель в методе update после события POINTERUP', () => {
    // 1. Нажимаем и отпускаем кнопку
    pointerObservableCallback({
      type: PointerEventTypes.POINTERDOWN,
      event: { button: 0 }
    });
    pointerObservableCallback({
      type: PointerEventTypes.POINTERUP,
      event: { button: 0 }
    });

    // Очищаем мок
    jest.clearAllMocks();

    // 2. Вызываем update
    controller.update(0.1);

    // Не должен вызывать Raycasting для обновления цели от мыши
    // Но может вызывать moveTo, если цель уже была установлена
    expect(sceneMock.createPickingRay).not.toHaveBeenCalled();
  });
});
