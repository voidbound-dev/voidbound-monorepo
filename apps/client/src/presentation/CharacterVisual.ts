import { Scene, SpriteManager, Sprite, Vector3 } from 'babylonjs';
import { Character } from '@voidbound/domain';

/**
 * Скорость интерполяции для плавного движения.
 */
const LERP_SPEED = 10;

/**
 * Скорость интерполяции для поворота.
 */
const ROTATION_SPEED = 8;

/**
 * Класс для визуального представления персонажа в игре.
 * Отвечает за создание и обновление спрайта персонажа.
 */
export class CharacterVisual {
  private spriteManager: SpriteManager;
  private sprite: Sprite;
  private currentPosition: Vector3;

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
    const { x, y } = this.character.position;
    this.currentPosition = new Vector3(x, 0, y);
    this.update(0);
  }

  /**
   * Обновляет визуальное состояние согласно данным из домена.
   * @param deltaTime Время, прошедшее с последнего кадра (в секундах).
   */
  public update(deltaTime: number = 0): void {
    const targetX = this.character.position.x;
    const targetZ = this.character.position.y;
    const targetPosition = new Vector3(targetX, 0, targetZ);
    
    if (deltaTime === 0) {
      this.currentPosition.copyFrom(targetPosition);
    } else {
      // Плавная интерполяция позиции
      const lerpFactor = Math.min(deltaTime * LERP_SPEED, 1);
      Vector3.LerpToRef(this.currentPosition, targetPosition, lerpFactor, this.currentPosition);
      
      // Плавный поворот в сторону движения
      this.updateRotation(targetPosition, deltaTime);
    }
    
    this.sprite.position.copyFrom(this.currentPosition);
  }

  /**
   * Обновляет угол поворота спрайта в зависимости от направления движения.
   */
  private updateRotation(targetPosition: Vector3, deltaTime: number): void {
    const direction = targetPosition.subtract(this.currentPosition);
    
    // Если мы почти приехали или не движемся, не меняем угол
    if (direction.length() < 0.01) return;

    // Вычисляем целевой угол на плоскости XZ
    // В Babylon angle для Sprite идет в радианах
    const targetAngle = Math.atan2(direction.x, direction.z);
    
    // Плавная интерполяция угла
    // Для простоты используем линейную интерполяцию, 
    // хотя для углов лучше использовать Shortest Angle Lerp
    let diff = targetAngle - this.sprite.angle;
    
    // Нормализация разности углов (-PI до PI)
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    this.sprite.angle += diff * Math.min(deltaTime * ROTATION_SPEED, 1);
  }

  /**
   * Возвращает объект спрайта Babylon.js.
   */
  public getSprite(): Sprite {
    return this.sprite;
  }
}
