import { Coordinates } from '../models/Coordinates';
import { Character } from '../models/Character';

describe('Сущность Character', () => {
  const defaultPos = new Coordinates(0, 0);
  const defaultSpeed = 5;

  it('должен создавать персонажа с валидными данными', () => {
    const character = new Character('1', 'Hero', defaultPos, defaultSpeed);
    expect(character.id).toBe('1');
    expect(character.name).toBe('Hero');
    expect(character.position.equals(defaultPos)).toBe(true);
    expect(character.speed).toBe(defaultSpeed);
  });

  it('должен выбрасывать ошибку, если скорость отрицательная', () => {
    expect(() => new Character('1', 'Hero', defaultPos, -1)).toThrow('Скорость не может быть отрицательной');
  });

  it('должен двигаться к цели', () => {
    const startPos = new Coordinates(0, 0);
    const targetPos = new Coordinates(10, 0);
    const speed = 2;
    const deltaTime = 1; // 1 секунда
    
    const character = new Character('1', 'Hero', startPos, speed);
    character.moveTo(targetPos, deltaTime);

    // Должен переместиться на 2 единицы к (10, 0) -> в итоге (2, 0)
    expect(character.position.x).toBe(2);
    expect(character.position.y).toBe(0);
  });

  it('не должен проскакивать мимо цели', () => {
    const startPos = new Coordinates(0, 0);
    const targetPos = new Coordinates(1, 0);
    const speed = 5;
    const deltaTime = 1;
    
    const character = new Character('1', 'Hero', startPos, speed);
    character.moveTo(targetPos, deltaTime);

    // Скорость * deltaTime = 5, но цель на расстоянии 1.
    expect(character.position.x).toBe(1);
    expect(character.position.y).toBe(0);
  });

  it('должен корректно двигаться по диагонали', () => {
    const startPos = new Coordinates(0, 0);
    const targetPos = new Coordinates(3, 4); // расстояние 5
    const speed = 5;
    const deltaTime = 0.5; // должен переместиться на 2.5 единицы
    
    const character = new Character('1', 'Hero', startPos, speed);
    character.moveTo(targetPos, deltaTime);

    // Вектор направления (3/5, 4/5) = (0.6, 0.8)
    // Расстояние перемещения = 2.5
    // Новая позиция = (0 + 0.6 * 2.5, 0 + 0.8 * 2.5) = (1.5, 2.0)
    expect(character.position.x).toBeCloseTo(1.5);
    expect(character.position.y).toBeCloseTo(2.0);
  });
});
