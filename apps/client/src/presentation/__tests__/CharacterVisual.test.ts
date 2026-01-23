import { NullEngine, Engine } from 'babylonjs';
import { GameScene } from '../GameScene';
import { CharacterVisual } from '../CharacterVisual';
import { Character, Coordinates } from '@voidbound/domain';

describe('CharacterVisual', () => {
  let engine: Engine;
  let gameScene: GameScene;

  beforeEach(() => {
    engine = new NullEngine();
    gameScene = new GameScene(engine);
  });

  afterEach(() => {
    engine.dispose();
  });

  it('должен создавать SpriteManager для отображения персонажа', () => {
    const character = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    new CharacterVisual(gameScene.getScene(), character);
    
    const spriteManager = gameScene.getScene().spriteManagers.find(sm => sm.name === 'CharacterManager');
    expect(spriteManager).toBeDefined();
  });

  it('должен иметь созданный спрайт', () => {
    const character = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    const visual = new CharacterVisual(gameScene.getScene(), character);
    
    expect(visual.getSprite()).toBeDefined();
  });

  it('должен обновлять позицию спрайта согласно позиции персонажа', () => {
    const character = new Character('1', 'Hero', new Coordinates(10, 20), 5);
    const visual = new CharacterVisual(gameScene.getScene(), character);
    
    visual.update();
    
    const sprite = visual.getSprite();
    // В нашей 2D проекции: X -> X, Y -> Z
    expect(sprite.position.x).toBe(10);
    expect(sprite.position.z).toBe(20);
    expect(sprite.position.y).toBe(0);
  });
});
