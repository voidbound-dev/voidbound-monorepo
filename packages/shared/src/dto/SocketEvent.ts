/**
 * Базовый интерфейс для событий сокетов.
 */
export interface SocketEvent<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: number;
}

/**
 * Псевдоним для SocketEvent.
 */
export type SocketMessage<T = unknown> = SocketEvent<T>;

/**
 * Фабрика для создания событий сокетов.
 */
export const createSocketEvent = <T>(type: string, payload: T): SocketEvent<T> => ({
  type,
  payload,
  timestamp: Date.now(),
});
