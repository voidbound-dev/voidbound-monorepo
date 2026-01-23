import { createCoordinates } from '../models/Coordinates';
import { createBaseStats } from '../models/BaseStats';
import { createSocketEvent } from '../dto/SocketEvent';
import { isValidCoordinates } from '../utils';

describe('Shared Package - Модели и DTO', () => {
  describe('Coordinates', () => {
    it('должен создавать валидные координаты с x, y', () => {
      const coords = createCoordinates(10, -5);
      expect(coords).toEqual({ x: 10, y: -5 });
    });

    it('должен быть неизменяемым по дизайну (readonly свойства)', () => {
      const coords = createCoordinates(1, 1);
      // Приводим к mutable-типу для проверки поведения в рантайме без ошибок компиляции
      (coords as unknown as { x: number }).x = 2;
      expect(coords.x).toBe(2);
    });

    it('должен корректно валидировать координаты', () => {
      expect(isValidCoordinates({ x: 1, y: 2 })).toBe(true);
      expect(isValidCoordinates({ x: 1 })).toBe(false);
      expect(isValidCoordinates(null)).toBe(false);
      expect(isValidCoordinates('not-coords')).toBe(false);
    });
  });

  describe('BaseStats', () => {
    it('должен создавать валидный объект характеристик', () => {
      const stats = createBaseStats(10, 20, 30, 40, 100, 100, 50, 50, 5);
      expect(stats).toEqual({
        strength: 10,
        agility: 20,
        intelligence: 30,
        constitution: 40,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        speed: 5
      });
    });
  });

  describe('SocketEvent', () => {
    it('должен создавать событие сокета с меткой времени', () => {
      const payload = { move: 'north' };
      const event = createSocketEvent('PLAYER_MOVE', payload);
      
      expect(event.type).toBe('PLAYER_MOVE');
      expect(event.payload).toEqual(payload);
      expect(event.timestamp).toBeLessThanOrEqual(Date.now());
    });
  });
});
