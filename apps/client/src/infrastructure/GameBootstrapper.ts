import { Engine } from 'babylonjs';
import { GameScene } from '../presentation/GameScene';
import { CharacterVisual } from '../presentation/CharacterVisual';
import { Character, Coordinates } from '@voidbound/domain';
import { PlayerMovementController } from '../application/PlayerMovementController';
import { SkillController } from '../application/SkillController';
import { InputService } from '../application/InputService';
import { ConsoleLogger } from './ConsoleLogger';
import { Inventory, Equipment } from '@voidbound/domain';
import { InventoryViewModel } from '../application/inventory/InventoryViewModel';

/**
 * Класс для инициализации и запуска игры.
 * Управляет жизненным циклом движка Babylon.js.
 */
export class GameBootstrapper {
  private engine: Engine;
  private gameScene: GameScene;
  private character: Character;
  private characterVisual: CharacterVisual;
  private movementController: PlayerMovementController;
  private skillController: SkillController;
  private inputService: InputService;
  private logger: ConsoleLogger;
  private inventoryViewModel: InventoryViewModel;

  constructor(canvas: HTMLCanvasElement) {
    this.logger = new ConsoleLogger();
    this.engine = new Engine(canvas, true);
    this.gameScene = new GameScene(this.engine);
    
    // Инициализация сервисов
    this.inputService = new InputService(this.gameScene.getScene(), this.logger);

    // Инициализация инвентаря
    const inventory = new Inventory(20, 100);
    const equipment = new Equipment();
    this.inventoryViewModel = new InventoryViewModel(inventory, equipment, this.inputService);

    // Подписка на изменение видимости для блокировки ввода
    this.inventoryViewModel.subscribe(() => {
      if (this.inventoryViewModel.isVisible) {
        this.movementController.setEnabled(false);
      } else {
        this.movementController.setEnabled(true);
      }
    });

    // Инициализация базового персонажа
    this.character = new Character('hero-1', 'Void Walker', new Coordinates(0, 0), 5);
    this.characterVisual = new CharacterVisual(this.gameScene.getScene(), this.character);

    // Инициализация контроллера перемещения
    this.movementController = new PlayerMovementController(
      this.gameScene.getScene(), 
      this.character,
      this.logger
    );

    // Инициализация контроллера умений
    this.skillController = new SkillController(
      this.gameScene.getScene(),
      this.character,
      this.logger,
      this.inputService
    );
  }

  public getInventoryViewModel(): InventoryViewModel {
    return this.inventoryViewModel;
  }

  /**
   * Запускает цикл рендеринга.
   */
  public run(): void {
    this.logger.info('Игра запущена');
    this.engine.runRenderLoop(() => {
      const deltaTime = this.engine.getDeltaTime() / 1000;

      // Обновление логики
      this.movementController.update(deltaTime);
      this.skillController.update(deltaTime);

      // Обновление визуализации
      this.characterVisual.update(deltaTime);
      
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
