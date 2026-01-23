import { Character } from '../models/Character';
import { Coordinates } from '../models/Coordinates';
import { VoidStrike } from '../models/VoidStrike';

describe('Void Strike', () => {
  let caster: Character;
  let skill: VoidStrike;

  beforeEach(() => {
    caster = new Character('1', 'Hero', new Coordinates(0, 0), 5);
    skill = new VoidStrike();
  });

  test('Void Strike должен быть готов к использованию сразу после создания', () => {
    expect(skill.isReady()).toBe(true);
    expect(skill.currentCooldown).toBe(0);
  });

  test('Void Strike должен корректно рассчитывать урон в диапазоне от 10 до 15', () => {
    const result = skill.use(caster);
    
    expect(result.success).toBe(true);
    expect(result.damage).toBeGreaterThanOrEqual(10);
    expect(result.damage).toBeLessThanOrEqual(15);
    expect(result.damageType).toBe('VOID');
  });

  test('Void Strike не должен срабатывать, если он находится на перезарядке', () => {
    skill.use(caster); // Первый раз используем
    const result = skill.use(caster); // Второй раз сразу же
    
    expect(result.success).toBe(false);
    expect(result.damage).toBe(0);
  });

  test('Перезарядка Void Strike должна корректно уменьшаться при вызове update', () => {
    skill.use(caster);
    expect(skill.isReady()).toBe(false);
    
    skill.update(0.5);
    expect(skill.isReady()).toBe(false);
    expect(skill.currentCooldown).toBeCloseTo(0.5);
    
    skill.update(0.5);
    expect(skill.isReady()).toBe(true);
    expect(skill.currentCooldown).toBe(0);
  });

  test('Использование умения должно устанавливать перезарядку', () => {
    skill.use(caster);
    expect(skill.currentCooldown).toBe(skill.cooldown);
  });
});
