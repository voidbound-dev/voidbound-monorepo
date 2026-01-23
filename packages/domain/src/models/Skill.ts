import { Character } from './Character';
import { Coordinates } from './Coordinates';

/**
 * Типы урона в игре.
 */
export type DamageType = 'PHYSICAL' | 'VOID' | 'ELEMENTAL';

/**
 * Результат применения умения.
 * Value Object.
 */
export class SkillResult {
  constructor(
    public readonly success: boolean,
    public readonly damage: number = 0,
    public readonly damageType: DamageType = 'PHYSICAL'
  ) {}

  /**
   * Создает неудачный результат применения.
   */
  public static fail(): SkillResult {
    return new SkillResult(false);
  }

  /**
   * Создает успешный результат применения.
   */
  public static success(damage: number, damageType: DamageType): SkillResult {
    return new SkillResult(true, damage, damageType);
  }
}

/**
 * Интерфейс для всех умений в игре.
 */
export interface ISkill {
  readonly id: string;
  readonly name: string;
  readonly cooldown: number;
  readonly currentCooldown: number;
  readonly radius: number;

  /**
   * Применение умения.
   * @param caster Тот, кто применяет умение.
   * @param target Целевые координаты (опционально).
   */
  use(caster: Character, target?: Coordinates): SkillResult;

  /**
   * Обновление состояния умения (уменьшение КД).
   * @param dt Дельта времени в секундах.
   */
  update(dt: number): void;

  /**
   * Готово ли умение к использованию.
   */
  isReady(): boolean;
}
