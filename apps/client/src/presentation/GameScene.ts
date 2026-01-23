import { Scene, Engine, HemisphericLight, Vector3, FreeCamera, Camera } from 'babylonjs';

/**
 * Класс для управления основной сценой Babylon.js.
 * Отвечает за настройку камеры, освещения и базовых параметров сцены.
 */
export class GameScene {
  private scene: Scene;

  constructor(engine: Engine) {
    this.scene = new Scene(engine);
    this.setupCamera();
    this.setupLights();
  }

  /**
   * Настраивает ортографическую камеру для 2D-вида.
   */
  private setupCamera(): void {
    const camera = new FreeCamera('camera', new Vector3(0, 10, 0), this.scene);
    camera.setTarget(Vector3.Zero());
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

    // Настройка ортографических границ
    // В 2D режиме мы хотим, чтобы 1 единица мира соответствовала какому-то количеству пикселей.
    // Пока установим фиксированный размер для тестов.
    const orthoSize = 5;
    camera.orthoTop = orthoSize;
    camera.orthoBottom = -orthoSize;
    camera.orthoLeft = -orthoSize;
    camera.orthoRight = orthoSize;
    
    // Если есть возможность получить aspect ratio, обновим лево/право
    const engine = this.scene.getEngine();
    if (engine.getRenderWidth() > 0 && engine.getRenderHeight() > 0) {
      const aspect = engine.getAspectRatio(camera);
      camera.orthoLeft = -orthoSize * aspect;
      camera.orthoRight = orthoSize * aspect;
    }
  }

  private setupLights(): void {
    new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
  }

  public getScene(): Scene {
    return this.scene;
  }
}
