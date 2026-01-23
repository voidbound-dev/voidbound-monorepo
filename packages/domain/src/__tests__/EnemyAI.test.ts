import { Enemy, EnemyState } from '../models/Enemy';
import { Character } from '../models/Character';
import { Coordinates } from '../models/Coordinates';

describe('Enemy AI', () => {
  const defaultStats = {
    agressionRadius: 10,
    attackRadius: 2,
    speed: 5
  };

  let enemy: Enemy;

  beforeEach(() => {
    enemy = new Enemy(
      'enemy-1',
      'Void Minion',
      new Coordinates(0, 0),
      defaultStats
    );
  });

  test('должен начинать в состоянии Idle', () => {
    expect(enemy.state).toBe(EnemyState.Idle);
  });

  test('должен переходить в состояние Chase, если игрок в радиусе агрессии', () => {
    // Игрок подходит на расстояние 8 (в пределах 10)
    const nearPlayer = new Character('p1', 'H', new Coordinates(8, 0), 5);
    
    enemy.update(1, nearPlayer);
    
    expect(enemy.state).toBe(EnemyState.Chase);
    expect(enemy.destination).toEqual(nearPlayer.position);
  });

  test('не должен переходить в Chase, если игрок вне радиуса агрессии', () => {
    // Игрок на расстоянии 12 (вне 10)
    const farPlayer = new Character('p1', 'H', new Coordinates(12, 0), 5);
    
    enemy.update(1, farPlayer);
    
    expect(enemy.state).toBe(EnemyState.Idle);
  });

  test('должен переходить в состояние Attack, если игрок в радиусе атаки', () => {
    // Игрок на расстоянии 1.5 (в пределах 2)
    const targetPlayer = new Character('p1', 'H', new Coordinates(1.5, 0), 5);
    
    // Сначала входим в Chase (или сразу в Attack из Idle, если логика позволяет)
    enemy.update(1, targetPlayer);
    
    expect(enemy.state).toBe(EnemyState.Attack);
    expect(enemy.destination).toBeNull();
  });

  test('должен возвращаться в Idle, если цель потеряна', () => {
    const nearPlayer = new Character('p1', 'H', new Coordinates(5, 0), 5);
    enemy.update(1, nearPlayer);
    expect(enemy.state).toBe(EnemyState.Chase);

    enemy.update(1, undefined);
    expect(enemy.state).toBe(EnemyState.Idle);
  });

  test('должен преследовать игрока в состоянии Chase', () => {
    const targetPlayer = new Character('p1', 'H', new Coordinates(10, 0), 5);
    
    // Первый апдейт — увидели игрока, перешли в Chase
    enemy.update(0, targetPlayer);
    expect(enemy.state).toBe(EnemyState.Chase);
    
    // Второй апдейт — движение в сторону игрока
    // Скорость 5, deltaTime 1, значит должны продвинуться на 5 единиц к (10, 0)
    enemy.update(1, targetPlayer);
    
    expect(enemy.position.x).toBe(5);
    expect(enemy.position.y).toBe(0);
  });

  test('должен переходить из Chase обратно в Idle, если игрок вышел за радиус агрессии', () => {
    const nearPlayer = new Character('p1', 'H', new Coordinates(5, 0), 5);
    enemy.update(1, nearPlayer);
    expect(enemy.state).toBe(EnemyState.Chase);

    const farPlayer = new Character('p1', 'H', new Coordinates(15, 0), 5);
    enemy.update(1, farPlayer);
    expect(enemy.state).toBe(EnemyState.Idle);
  });
});
