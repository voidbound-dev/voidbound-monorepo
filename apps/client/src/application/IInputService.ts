/**
 * Перечисление всех возможных игровых действий, привязанных к вводу.
 */
export enum InputAction {
  USE_SKILL_1 = 'USE_SKILL_1',
  USE_SKILL_2 = 'USE_SKILL_2',
  USE_SKILL_3 = 'USE_SKILL_3',
  USE_SKILL_4 = 'USE_SKILL_4',
  INTERACT = 'INTERACT',
  OPEN_INVENTORY = 'OPEN_INVENTORY',
  MOVE_TO = 'MOVE_TO'
}

/**
 * Интерфейс сервиса управления вводом.
 */
export interface IInputService {
  /**
   * Подписка на конкретное действие.
   * @param action Действие
   * @param callback Функция обратного вызова
   */
  onAction(action: InputAction, callback: () => void): void;

  /**
   * Удаление подписки.
   * @param action Действие
   * @param callback Функция обратного вызова
   */
  offAction(action: InputAction, callback: () => void): void;
}
