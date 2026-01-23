import { NullEngine, Engine } from 'babylonjs';
import { GameScene } from '../GameScene';
import { CharacterVisual } from '../CharacterVisual';
import { Character, Coordinates } from '@voidbound/domain';

describe('CharacterVisual', () => {
  let engine!: Engine;
  let gameScene!: GameScene;

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
    
    const scene = gameScene.getScene();
    const spriteManager = scene.spriteManagers!.find(sm => sm.name === 'CharacterManager');
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
    
    visual.update(0.1);
    
    const sprite = visual.getSprite();
    // В нашей 2D проекции: X -> X, Y -> Z
    expect(sprite.position.x).toBe(10);
    expect(sprite.position.z).toBe(20);
    expect(sprite.position.y).toBe(0);
  });

  it('должен плавно перемещать визуальную модель к логической позиции', () => {
    const character = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    const visual = new CharacterVisual(gameScene.getScene(), character);
    
    // Мгновенно меняем позицию в домене (имитируем телепорт или резкий шаг)
    character.moveTo(new Coordinates(10, 10), 10); 
    
    expect(character.position.x).toBe(10);
    expect(character.position.y).toBe(10);

    // Первый кадр обновления визуализации
    const deltaTime = 0.016; // ~60 FPS
    visual.update(deltaTime);

    const sprite = visual.getSprite();
    
    // Визуальная позиция не должна сразу стать (10, 10)
    expect(sprite.position.x).toBeGreaterThan(0);
    expect(sprite.position.x).toBeLessThan(10);
    expect(sprite.position.z).toBeGreaterThan(0);
    expect(sprite.position.z).toBeLessThan(10);

    // Запоминаем промежуточную позицию
    const midX = sprite.position.x;

    // Еще один кадр
    visual.update(deltaTime);
    
    expect(sprite.position.x).toBeGreaterThan(midX);
    expect(sprite.position.x).toBeLessThan(10);
  });

  it('должен плавно изменять угол поворота при движении', () => {
    const character = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    const visual = new CharacterVisual(gameScene.getScene(), character);
    
    const sprite = visual.getSprite();
    const initialAngle = sprite.angle; // Обычно 0
    
    // Двигаемся вправо (X+)
    // В нашей логике targetAngle = Math.atan2(dx, dz)
    // dx=1, dz=0 => Math.atan2(1, 0) = PI/2
    character.moveTo(new Coordinates(1, 0), 1); 
    
    visual.update(0.016);
    
    // Угол должен начать меняться в сторону PI/2
    expect(sprite.angle).not.toBe(initialAngle);
    expect(sprite.angle).toBeGreaterThan(0);
    expect(sprite.angle).toBeLessThan(Math.PI / 2);
    
    const midAngle = sprite.angle;
    
    visual.update(0.016);
    // Продолжает меняться
    expect(sprite.angle).toBeGreaterThan(midAngle);
    expect(sprite.angle).toBeLessThan(Math.PI / 2);
  });
});
