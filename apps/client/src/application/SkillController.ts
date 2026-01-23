import { Scene, Vector3 } from 'babylonjs';
import { Character, ISkill, VoidStrike, ILogger } from '@voidbound/domain';
import { VoidStrikeVFX } from '../presentation/vfx/VoidStrikeVFX';

/**
 * Контроллер для управления умениями игрока.
 * Связывает ввод (горячие клавиши) с доменной логикой и визуальными эффектами.
 */
export class SkillController {
  private skills: Map<string, ISkill> = new Map();

  constructor(
    private scene: Scene,
    private character: Character,
    private logger: ILogger
  ) {
    // Регистрация базового умения Void Strike
    this.skills.set('void-strike', new VoidStrike());
    
    this.setupInput();
  }

  /**
   * Настройка горячих клавиш.
   */
  private setupInput(): void {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      // Кнопка 'Q' для Void Strike (в будущем вынести в конфиг)
      if (kbInfo.type === 1 && kbInfo.event.key.toLowerCase() === 'q') {
        this.useSkill('void-strike');
      }
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
