export interface Coordinates {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export type Vector3D = Coordinates;

export const createCoordinates = (x: number, y: number, z: number): Coordinates => ({
  x,
  y,
  z,
});
