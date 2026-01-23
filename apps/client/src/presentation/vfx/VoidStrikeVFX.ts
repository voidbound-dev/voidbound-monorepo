import { Scene, Vector3, ParticleSystem, Color4, Texture } from 'babylonjs';

/**
 * Визуальный эффект умения "Void Strike".
 * Создает эффект "пустотного взрыва" вокруг указанной позиции.
 */
export class VoidStrikeVFX {
  private particleSystem: ParticleSystem;

  constructor(scene: Scene, position: Vector3, radius: number) {
    // Создаем систему частиц
    this.particleSystem = new ParticleSystem('VoidStrikeVFX', 200, scene);
    
    // Настройка текстуры (используем стандартную заглушку, если нет своей)
    this.particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', scene);

    // Позиционирование
    this.particleSystem.emitter = position;
    
    // Настройка внешнего вида в стиле "Пустоты" (фиолетовые/черные тона)
    this.particleSystem.color1 = new Color4(0.5, 0, 0.5, 1.0);
    this.particleSystem.color2 = new Color4(0.2, 0, 0.3, 1.0);
    this.particleSystem.colorDead = new Color4(0, 0, 0, 0.0);

    // Размер и радиус
    // Радиус из домена 2.0, частицы должны покрывать эту область
    this.particleSystem.minSize = 0.5;
    this.particleSystem.maxSize = 1.0;
    
    this.particleSystem.createSphereEmitter(radius);

    // Жизненный цикл
    this.particleSystem.minLifeTime = 0.3;
    this.particleSystem.maxLifeTime = 0.6;
    
    this.particleSystem.emitRate = 500;
    
    // Самоочистка
    this.particleSystem.targetStopDuration = 0.5; // Эффект длится полсекунды
    this.particleSystem.disposeOnStop = true;

    // Запуск
    this.particleSystem.start();
  }
}
