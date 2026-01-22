export interface SocketEvent<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: number;
}

export type SocketMessage<T = unknown> = SocketEvent<T>;

export const createSocketEvent = <T>(type: string, payload: T): SocketEvent<T> => ({
  type,
  payload,
  timestamp: Date.now(),
});
