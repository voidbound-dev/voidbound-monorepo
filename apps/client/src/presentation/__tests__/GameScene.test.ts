import { Engine, NullEngine, Scene, Camera } from 'babylonjs';
import { GameScene } from '../GameScene';

describe('GameScene', () => {
  let engine!: Engine;

  beforeEach(() => {
    engine = new NullEngine();
  });

  afterEach(() => {
    engine.dispose();
  });

  it('должен успешно инициализировать сцену Babylon.js', () => {
    const gameScene = new GameScene(engine);
    expect(gameScene.getScene()).toBeInstanceOf(Scene);
  });

  it('должен иметь активную ортографическую камеру', () => {
    const gameScene = new GameScene(engine);
    const camera = gameScene.getScene().activeCamera;
    expect(camera).toBeDefined();
    expect(camera?.mode).toBe(Camera.ORTHOGRAPHIC_CAMERA);
  });

  it('должен иметь источник света', () => {
    const gameScene = new GameScene(engine);
    const scene = gameScene.getScene();
    expect(scene.lights.length).toBeGreaterThan(0);
  });
});
