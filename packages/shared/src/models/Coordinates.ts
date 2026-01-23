export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

export type Vector2D = Coordinates;

export const createCoordinates = (x: number, y: number): Coordinates => ({
  x,
  y,
});
