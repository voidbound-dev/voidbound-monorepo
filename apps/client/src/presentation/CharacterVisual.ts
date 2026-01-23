import { Scene, SpriteManager, Sprite } from 'babylonjs';
import { Character } from '@voidbound/domain';

/**
 * Класс для визуального представления персонажа в игре.
 * Отвечает за создание и обновление спрайта персонажа.
 */
export class CharacterVisual {
  private spriteManager: SpriteManager;
  private sprite: Sprite;

  constructor(scene: Scene, private character: Character) {
    // Временная ссылка на текстуру (placeholder). 
    // В будущем это должно быть вынесено в конфигурацию или менеджер ассетов.
    const spriteUrl = 'https://assets.babylonjs.com/sprites/player.png';
    
    // Создаем менеджер спрайтов. 
    // Имя 'CharacterManager' используется для поиска в тестах.
    this.spriteManager = new SpriteManager('CharacterManager', spriteUrl, 1, { width: 64, height: 64 }, scene);
    
    // Создаем сам спрайт
    this.sprite = new Sprite('characterSprite', this.spriteManager);
    
    // Начальная синхронизация позиции
    this.update();
  }

  /**
   * Обновляет визуальное состояние согласно данным из домена.
   */
  public update(): void {
    const { x, y } = this.character.position;
    
    // В нашей ортографической проекции:
    // X (domain) -> X (world)
    // Y (domain) -> Z (world) — плоскость земли
    this.sprite.position.x = x;
    this.sprite.position.z = y;
    this.sprite.position.y = 0; // Спрайт лежит на плоскости
  }

  /**
   * Возвращает объект спрайта Babylon.js.
   */
  public getSprite(): Sprite {
    return this.sprite;
  }
}
