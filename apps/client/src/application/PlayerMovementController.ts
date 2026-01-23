import { Scene, PointerEventTypes, PointerInfo, Plane, Vector3 } from 'babylonjs';
import { Character, Coordinates, ILogger } from '@voidbound/domain';

/**
 * Контроллер для управления перемещением игрока.
 * Слушает события ввода и обновляет доменную модель персонажа.
 */
export class PlayerMovementController {
  private _isPointerDown: boolean = false;

  constructor(
    private scene: Scene,
    private character: Character,
    private logger: ILogger
  ) {
    this.setupInput();
  }

  /**
   * Настраивает подписку на события мыши.
   */
  private setupInput(): void {
    this.scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
      // Нас интересует только левая кнопка мыши
      if (pointerInfo.event.button !== 0) return;

      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        this._isPointerDown = true;
        this.updateDestinationFromMouse(true);
      } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
        this._isPointerDown = false;
      }
    });
  }

  /**
   * Обновляет цель перемещения персонажа на основе текущего положения курсора.
   * @param isInitialClick Флаг первого клика для логирования.
   */
  private updateDestinationFromMouse(isInitialClick: boolean = false): void {
    if (isInitialClick) {
      this.logger.debug(`Клик зафиксирован: x=${this.scene.pointerX}, y=${this.scene.pointerY}`);
    }

    const ray = this.scene.createPickingRay(
      this.scene.pointerX,
      this.scene.pointerY,
      null,
      null
    );

    // Создаем математическую плоскость, соответствующую уровню земли (Y=0)
    const groundPlane = Plane.FromPositionAndNormal(Vector3.Zero(), new Vector3(0, 1, 0));
    
    // Находим дистанцию от луча до точки пересечения с плоскостью
    const distance = ray.intersectsPlane(groundPlane);

    if (distance !== null) {
      // Вычисляем точную точку пересечения в мировых координатах
      const pickedPoint = ray.origin.add(ray.direction.scale(distance));
      
      // В нашей системе:
      // Babylon X -> Domain X
      // Babylon Z -> Domain Y (плоскость земли Y=0)
      const target = new Coordinates(
        pickedPoint.x,
        pickedPoint.z
      );
      
      if (isInitialClick) {
        this.logger.info(`Установлена новая цель: x=${target.x.toFixed(2)}, y=${target.y.toFixed(2)}`);
      }
      this.character.setDestination(target);
    }
  }

  /**
   * Обновляет состояние перемещения персонажа.
   * Вызывается каждый кадр.
   * @param deltaTime Время с последнего кадра в секундах.
   */
  public update(deltaTime: number): void {
    // Если кнопка зажата, обновляем цель каждый кадр
    if (this._isPointerDown) {
      this.updateDestinationFromMouse();
    }

    const destination = this.character.destination;
    
    if (destination) {
      this.character.moveTo(destination, deltaTime);
      
      // Если мы очень близки к цели, можно её сбросить
      if (this.character.position.distanceTo(destination) < 0.01) {
        this.logger.info('Цель достигнута');
        this.character.setDestination(null);
      }
    }
  }
}
