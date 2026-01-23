import { Entity } from '@voidbound/shared';
import { Coordinates } from './Coordinates';

/**
 * Интерфейс для валидации перемещения по карте.
 */
export interface IMapValidator {
  isValidPosition(position: Coordinates): boolean;
}

/**
 * Сущность персонажа.
 * Отвечает за состояние и базовую логику перемещения.
 */
export class Character implements Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    private _position: Coordinates,
    private _speed: number
  ) {
    if (_speed < 0) {
      throw new Error('Скорость не может быть отрицательной');
    }
  }

  /**
   * Текущая позиция персонажа.
   */
  public get position(): Coordinates {
    return this._position;
  }

  /**
   * Скорость перемещения персонажа.
   */
  public get speed(): number {
    return this._speed;
  }

  /**
   * Перемещает персонажа в сторону целевой точки.
   * 
   * Формула: Position_new = Position_old + Normalize(Target - Position_old) * Speed * DeltaTime
   * 
   * @param target Целевые координаты.
   * @param deltaTime Время, прошедшее с последнего обновления (в секундах).
   * @param validator Необязательный валидатор карты для проверки возможности перемещения.
   */
  public moveTo(target: Coordinates, deltaTime: number, validator?: IMapValidator): void {
    const distance = this._position.distanceTo(target);
    
    if (distance === 0) return;

    const maxMoveDistance = this._speed * deltaTime;
    
    // Определяем желаемую новую позицию
    let nextPosition: Coordinates;

    if (distance <= maxMoveDistance) {
      nextPosition = target;
    } else {
      const ratio = maxMoveDistance / distance;
      const dx = (target.x - this._position.x) * ratio;
      const dy = (target.y - this._position.y) * ratio;

      nextPosition = new Coordinates(
        this._position.x + dx,
        this._position.y + dy
      );
    }

    // Валидация перемещения
    if (validator && !validator.isValidPosition(nextPosition)) {
      // В простейшем случае — просто не двигаемся. 
      // В будущем здесь может быть поиск пути или скольжение вдоль стен.
      return;
    }

    this._position = nextPosition;
  }
}
