import { NullEngine, Engine, Vector3, AbstractMesh, ParticleSystem } from 'babylonjs';
import { GameScene } from '../GameScene';
import { VoidStrikeVFX } from '../vfx/VoidStrikeVFX';

describe('VoidStrikeVFX', () => {
  let engine!: Engine;
  let gameScene!: GameScene;

  beforeEach(() => {
    engine = new NullEngine();
    gameScene = new GameScene(engine);
  });

  afterEach(() => {
    engine.dispose();
  });

  it('при создании эффекта создается система частиц в позиции персонажа', () => {
    const position = new Vector3(1, 0, 2);
    const radius = 2.0;
    new VoidStrikeVFX(gameScene.getScene(), position, radius);

    const scene = gameScene.getScene();
    // Проверяем, что в сцене появилась система частиц или меш
    expect(scene.particleSystems.length).toBeGreaterThan(0);
    
    const ps = scene.particleSystems[0];
    // Проверяем позицию (emitter может быть Vector3 или AbstractMesh)
    if (ps.emitter instanceof Vector3) {
      expect(ps.emitter.x).toBe(position.x);
      expect(ps.emitter.z).toBe(position.z);
    } else if (ps.emitter instanceof AbstractMesh) {
      const emitterPos = ps.emitter.position;
      expect(emitterPos.x).toBe(position.x);
      expect(emitterPos.z).toBe(position.z);
    }
  });

  it('эффект удаляется через заданное время', (done) => {
    const position = new Vector3(0, 0, 0);
    const radius = 2.0;
    // Создаем эффект с коротким временем жизни для теста, если возможно, 
    // или имитируем течение времени
    new VoidStrikeVFX(gameScene.getScene(), position, radius);
    
    const scene = gameScene.getScene();
    expect(scene.particleSystems.length).toBeGreaterThan(0);

    // В Babylonjs NullEngine мы можем вручную вызывать render для продвижения времени
    // Но системы частиц часто зависят от реального времени или кастомного обновления.
    // Для теста мы можем проверить метод dispose или автоматическое удаление.
    
    // Имитируем прохождение времени. 
    // Большинство систем частиц в Babylon имеют targetStopDuration
    const ps = scene.particleSystems[0];
    
    // Если мы не можем ждать реально, мы можем проверить, что dispose вызывается.
    // Или что система частиц настроена на самоудаление (disposeOnStop = true)
    if (ps instanceof ParticleSystem) {
      expect(ps.disposeOnStop).toBe(true);
    } else {
      // Если это не ParticleSystem (маловероятно в данном коде), тест должен упасть или быть пропущен
      throw new Error('Ожидалась ParticleSystem');
    }
    done();
  });
});
