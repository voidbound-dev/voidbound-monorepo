import { Scene, KeyboardEventTypes } from 'babylonjs';
import { ILogger } from '@voidbound/domain';
import { InputService } from '../InputService';
import { InputAction } from '../IInputService';

// Мокаем Babylon.js
jest.mock('babylonjs', () => {
  return {
    KeyboardEventTypes: {
      KEYDOWN: 1,
      KEYUP: 2
    },
    Observable: class {
      add(callback: (kbInfo: unknown) => void) {
        this.callback = callback;
      }
      callback: ((kbInfo: unknown) => void) | null = null;
      notifyObservers(info: unknown) {
        if (this.callback) this.callback(info);
      }
    }
  };
});

describe('InputService', () => {
  let sceneMock: Partial<Scene>;
  let loggerMock: ILogger;
  let inputService: InputService;
  let keyboardObservable: {
    add: jest.Mock;
    callback: ((info: unknown) => void) | null;
  };

  beforeEach(() => {
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    keyboardObservable = {
      add: jest.fn((callback: (info: unknown) => void) => {
        keyboardObservable.callback = callback;
      }),
      callback: null
    };

    sceneMock = {
      onKeyboardObservable: keyboardObservable as unknown as Scene['onKeyboardObservable']
    };

    const keyMap = new Map<string, InputAction>([
      ['q', InputAction.USE_SKILL_1],
      ['w', InputAction.USE_SKILL_2],
      ['e', InputAction.USE_SKILL_3],
      ['r', InputAction.USE_SKILL_4],
      ['i', InputAction.OPEN_INVENTORY]
    ]);

    inputService = new InputService(sceneMock as unknown as Scene, loggerMock, keyMap);
  });

  it('должен вызывать callback при нажатии назначенной клавиши', () => {
    const callback = jest.fn();
    inputService.onAction(InputAction.USE_SKILL_1, callback);

    // Эмулируем нажатие клавиши 'q'
    keyboardObservable.callback!({
      type: KeyboardEventTypes.KEYDOWN,
      event: { key: 'q' }
    });

    expect(callback).toHaveBeenCalled();
  });

  it('не должен вызывать callback при нажатии неназначенной клавиши', () => {
    const callback = jest.fn();
    inputService.onAction(InputAction.USE_SKILL_1, callback);

    // Эмулируем нажатие клавиши 'x'
    keyboardObservable.callback!({
      type: KeyboardEventTypes.KEYDOWN,
      event: { key: 'x' }
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('должен позволять отписываться от событий', () => {
    const callback = jest.fn();
    inputService.onAction(InputAction.USE_SKILL_1, callback);
    inputService.offAction(InputAction.USE_SKILL_1, callback);

    // Эмулируем нажатие клавиши 'q'
    keyboardObservable.callback!({
      type: KeyboardEventTypes.KEYDOWN,
      event: { key: 'q' }
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('должен корректно обрабатывать разные регистры клавиш', () => {
    const callback = jest.fn();
    inputService.onAction(InputAction.USE_SKILL_1, callback);

    // Эмулируем нажатие клавиши 'Q'
    keyboardObservable.callback!({
      type: KeyboardEventTypes.KEYDOWN,
      event: { key: 'Q' }
    });

    expect(callback).toHaveBeenCalled();
  });
});
