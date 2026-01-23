import { ISkill, SkillResult } from './Skill';
import { Character } from './Character';
import { Coordinates } from './Coordinates';

/**
 * Умение "Void Strike".
 * Наносит урон в области вокруг персонажа.
 */
export class VoidStrike implements ISkill {
  public readonly id: string = 'void-strike';
  public readonly name: string = 'Void Strike';
  public readonly cooldown: number = 1.0;
  public readonly radius: number = 2.0;
  
  private _currentCooldown: number = 0;

  public get currentCooldown(): number {
    return this._currentCooldown;
  }

  /**
   * Применение умения.
   */
  public use(_caster: Character, _target?: Coordinates): SkillResult {
    void _caster;
    void _target;
    if (!this.isReady()) {
      return SkillResult.fail();
    }

    // Расчет урона: случайное число от 10 до 15
    const damage = Math.floor(Math.random() * 6) + 10;
    
    // Используем переменные для подавления ворнингов, если они нужны для интерфейса
    // Или оставляем как есть, если конфиг разрешает _
    // В данном случае, судя по ошибке lint, они все равно светятся.
    
    // Переход в состояние перезарядки
    this._currentCooldown = this.cooldown;

    return SkillResult.success(damage, 'VOID');
  }

  /**
   * Обновление перезарядки.
   */
  public update(dt: number): void {
    if (this._currentCooldown > 0) {
      this._currentCooldown = Math.max(0, this._currentCooldown - dt);
    }
  }

  /**
   * Проверка готовности.
   */
  public isReady(): boolean {
    return this._currentCooldown <= 0;
  }
}
