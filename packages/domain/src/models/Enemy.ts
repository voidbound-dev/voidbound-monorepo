import { Character } from './Character';
import { Coordinates } from './Coordinates';

/**
 * Состояния ИИ врага.
 */
export enum EnemyState {
  /** Бездействие */
  Idle = 'Idle',
  /** Преследование цели */
  Chase = 'Chase',
  /** Атака цели */
  Attack = 'Attack',
}

/**
 * Характеристики врага.
 */
export interface EnemyStats {
  /** Радиус агрессии (обнаружения игрока) */
  agressionRadius: number;
  /** Радиус атаки */
  attackRadius: number;
  /** Скорость перемещения */
  speed: number;
}

/**
 * Сущность врага с базовым ИИ.
 */
export class Enemy extends Character {
  private _state: EnemyState = EnemyState.Idle;
  private _stats: EnemyStats;

  constructor(
    id: string,
    name: string,
    position: Coordinates,
    stats: EnemyStats
  ) {
    super(id, name, position, stats.speed);
    this._stats = stats;
  }

  /**
   * Текущее состояние ИИ.
   */
  public get state(): EnemyState {
    return this._state;
  }

  /**
   * Обновление логики врага.
   * @param deltaTime Время с последнего кадра (в секундах).
   * @param target Потенциальная цель (например, игрок).
   */
  public update(deltaTime: number, target?: Character): void {
    if (!target) {
      this.transitionToIdle();
      return;
    }

    const distanceToTarget = this.position.distanceTo(target.position);

    switch (this._state) {
      case EnemyState.Idle:
        this.handleIdleState(distanceToTarget, target);
        break;
      case EnemyState.Chase:
        this.handleChaseState(distanceToTarget, target, deltaTime);
        break;
      case EnemyState.Attack:
        this.handleAttackState(distanceToTarget, target);
        break;
    }
  }

  private handleIdleState(distance: number, target: Character): void {
    if (distance <= this._stats.attackRadius) {
      this.transitionToAttack();
    } else if (distance <= this._stats.agressionRadius) {
      this.transitionToChase(target);
    }
  }

  private handleChaseState(distance: number, target: Character, deltaTime: number): void {
    if (distance <= this._stats.attackRadius) {
      this.transitionToAttack();
    } else if (distance > this._stats.agressionRadius) {
      this.transitionToIdle();
    } else {
      // Обновляем цель перемещения и двигаемся
      this.setDestination(target.position);
      if (deltaTime > 0) {
        this.moveTo(target.position, deltaTime);
      }
    }
  }

  private handleAttackState(distance: number, target: Character): void {
    if (distance > this._stats.attackRadius && distance <= this._stats.agressionRadius) {
      this.transitionToChase(target);
    } else if (distance > this._stats.agressionRadius) {
      this.transitionToIdle();
    }
  }

  private transitionToIdle(): void {
    this._state = EnemyState.Idle;
    this.setDestination(null);
  }

  private transitionToChase(target: Character): void {
    this._state = EnemyState.Chase;
    this.setDestination(target.position);
  }

  private transitionToAttack(): void {
    this._state = EnemyState.Attack;
    this.setDestination(null);
  }
}
