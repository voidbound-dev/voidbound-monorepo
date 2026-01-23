/**
 * Интерфейс координат.
 */
export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

/**
 * Тип для 2D вектора (аналог координат).
 */
export type Vector2D = Coordinates;

/**
 * Фабрика для создания координат.
 */
export const createCoordinates = (x: number, y: number): Coordinates => ({
  x,
  y,
});
