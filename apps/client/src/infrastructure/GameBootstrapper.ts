import { Engine } from 'babylonjs';
import { GameScene } from '../presentation/GameScene';
import { CharacterVisual } from '../presentation/CharacterVisual';
import { Character, Coordinates } from '@voidbound/domain';

/**
 * Класс для инициализации и запуска игры.
 * Управляет жизненным циклом движка Babylon.js.
 */
export class GameBootstrapper {
  private engine: Engine;
  private gameScene: GameScene;
  private characterVisual: CharacterVisual;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.gameScene = new GameScene(this.engine);
    
    // Инициализация базового персонажа для визуализации
    const character = new Character('hero-1', 'Void Walker', new Coordinates(0, 0), 5);
    this.characterVisual = new CharacterVisual(this.gameScene.getScene(), character);
  }

  /**
   * Запускает цикл рендеринга.
   */
  public run(): void {
    this.engine.runRenderLoop(() => {
      // В будущем здесь будет вызов систем обновления (Update Systems)
      this.characterVisual.update();
      this.gameScene.getScene().render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  /**
   * Останавливает движок и очищает ресурсы.
   */
  public dispose(): void {
    this.engine.dispose();
  }
}
