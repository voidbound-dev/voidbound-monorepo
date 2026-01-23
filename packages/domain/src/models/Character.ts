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
  private _destination: Coordinates | null = null;
  private _path: Coordinates[] = [];

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
   * Целевая точка перемещения.
   */
  public get destination(): Coordinates | null {
    return this._destination;
  }

  /**
   * Скорость перемещения персонажа.
   */
  public get speed(): number {
    return this._speed;
  }

  /**
   * Текущий путь (очередь точек).
   */
  public get path(): ReadonlyArray<Coordinates> {
    return this._path;
  }

  /**
   * Устанавливает новый путь перемещения.
   * @param path Массив координат.
   */
  public setPath(path: Coordinates[]): void {
    this._path = [...path];
    this._destination = path.length > 0 ? path[0] : null;
  }

  /**
   * Устанавливает новую цель перемещения (сбрасывает путь).
   * @param target Координаты цели или null для остановки.
   */
  public setDestination(target: Coordinates | null): void {
    this._destination = target;
    this._path = target ? [target] : [];
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
    
    if (distance === 0) {
      this.advancePath();
      return;
    }

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
      return;
    }

    this._position = nextPosition;

    // Если достигли промежуточной цели, переходим к следующей
    if (this._position.equals(target)) {
      this.advancePath();
    }
  }

  private advancePath(): void {
    if (this._path.length > 0) {
      this._path.shift();
      this._destination = this._path.length > 0 ? this._path[0] : null;
    }
  }
}
