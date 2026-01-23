import { Scene, KeyboardEventTypes, KeyboardInfo } from 'babylonjs';
import { ILogger } from '@voidbound/domain';
import { IInputService, InputAction } from './IInputService';

/**
 * Реализация сервиса управления вводом.
 * Преобразует низкоуровневые события Babylon.js в высокоуровневые игровые действия.
 */
export class InputService implements IInputService {
  private _listeners: Map<InputAction, Array<() => void>> = new Map();
  private _keyMap: Map<string, InputAction>;

  constructor(
    private scene: Scene,
    private logger: ILogger,
    keyMap?: Map<string, InputAction>
  ) {
    // Дефолтный маппинг, если не передан
    this._keyMap = keyMap || new Map([
      ['q', InputAction.USE_SKILL_1],
      ['w', InputAction.USE_SKILL_2],
      ['e', InputAction.USE_SKILL_3],
      ['r', InputAction.USE_SKILL_4],
      ['i', InputAction.OPEN_INVENTORY]
    ]);

    this.setupKeyboard();
  }

  /**
   * Настройка слушателя клавиатуры Babylon.js.
   */
  private setupKeyboard(): void {
    this.scene.onKeyboardObservable.add((kbInfo: KeyboardInfo) => {
      if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        const key = kbInfo.event.key.toLowerCase();
        const action = this._keyMap.get(key);

        if (action) {
          this.triggerAction(action);
        }
      }
    });
  }

  /**
   * Вызывает все зарегистрированные колбэки для действия.
   */
  private triggerAction(action: InputAction): void {
    const listeners = this._listeners.get(action);
    if (listeners) {
      this.logger.debug(`Сработало действие: ${action}`);
      listeners.forEach(callback => callback());
    }
  }

  /**
   * Подписка на действие.
   */
  public onAction(action: InputAction, callback: () => void): void {
    if (!this._listeners.has(action)) {
      this._listeners.set(action, []);
    }
    this._listeners.get(action)?.push(callback);
  }

  /**
   * Удаление подписки.
   */
  public offAction(action: InputAction, callback: () => void): void {
    const listeners = this._listeners.get(action);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
