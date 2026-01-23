import { Coordinates } from '../models/Coordinates';

export const isValidCoordinates = (coords: unknown): coords is Coordinates => {
  if (!coords || typeof coords !== 'object') return false;
  const c = coords as Record<string, unknown>;
  return (
    typeof c['x'] === 'number' &&
    typeof c['y'] === 'number'
  );
};
