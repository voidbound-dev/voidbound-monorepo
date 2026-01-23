import { Scene, Vector3 } from 'babylonjs';
import { Character, ISkill, VoidStrike, ILogger } from '@voidbound/domain';
import { VoidStrikeVFX } from '../presentation/vfx/VoidStrikeVFX';
import { IInputService, InputAction } from './IInputService';

/**
 * Контроллер для управления умениями игрока.
 * Связывает ввод (горячие клавиши) с доменной логикой и визуальными эффектами.
 */
export class SkillController {
  private skills: Map<string, ISkill> = new Map();

  constructor(
    private scene: Scene,
    private character: Character,
    private logger: ILogger,
    private inputService: IInputService
  ) {
    // Регистрация базового умения Void Strike
    this.skills.set('void-strike', new VoidStrike());
    
    this.setupInput();
  }

  /**
   * Настройка горячих клавиш через InputService.
   */
  private setupInput(): void {
    this.inputService.onAction(InputAction.USE_SKILL_1, () => {
      this.useSkill('void-strike');
    });
  }

  /**
   * Попытка использования умения.
   */
  public useSkill(skillId: string): void {
    const skill = this.skills.get(skillId);
    if (!skill) return;

    const result = skill.use(this.character);

    if (result.success) {
      this.logger.info(`Использовано умение: ${skill.name}. Урон: ${result.damage}`);
      
      // Запуск VFX
      if (skillId === 'void-strike') {
        const pos = new Vector3(this.character.position.x, 0, this.character.position.y);
        new VoidStrikeVFX(this.scene, pos, skill.radius);
      }
    } else {
      this.logger.debug(`Умение ${skill.name} еще не готово (КД: ${skill.currentCooldown.toFixed(1)}с)`);
    }
  }

  /**
   * Обновление состояния умений (КД).
   */
  public update(deltaTime: number): void {
    this.skills.forEach(skill => skill.update(deltaTime));
  }
}
