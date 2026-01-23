import { Coordinates as ICoordinates } from '@voidbound/shared';

/**
 * Value Object для работы с координатами в 2D пространстве.
 * Неизменяемый (Immutable).
 */
export class Coordinates implements ICoordinates {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    Object.freeze(this);
  }

  /**
   * Проверяет равенство с другими координатами.
   */
  public equals(other: ICoordinates): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Складывает текущие координаты с другими и возвращает новый объект.
   */
  public add(other: ICoordinates): Coordinates {
    return new Coordinates(this.x + other.x, this.y + other.y);
  }

  /**
   * Вычисляет евклидово расстояние до других координат.
   */
  public distanceTo(other: ICoordinates): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
