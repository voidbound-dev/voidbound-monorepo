import { Item } from '../models/Item';
import { Equipment } from '../models/Equipment';
import { BaseStats, SlotType } from '@voidbound/shared';

describe('Агрегат Equipment', () => {
  const createEquippableItem = (id: string, slot: SlotType, stats?: Partial<BaseStats>) => 
    new Item(id, `Item ${id}`, 1, slot, stats as BaseStats);

  it('должен успешно надевать предмет в пустой слот', () => {
    const equipment = new Equipment();
    const weapon = createEquippableItem('w1', 'weapon');
    
    const previous = equipment.equip(weapon);
    
    expect(previous).toBeNull();
    expect(equipment.getSlot('weapon')).toBe(weapon);
  });

  it('должен заменять предмет в слоте и возвращать старый', () => {
    const equipment = new Equipment();
    const weapon1 = createEquippableItem('w1', 'weapon');
    const weapon2 = createEquippableItem('w2', 'weapon');
    
    equipment.equip(weapon1);
    const previous = equipment.equip(weapon2);
    
    expect(previous).toBe(weapon1);
    expect(equipment.getSlot('weapon')).toBe(weapon2);
  });

  it('должен выбрасывать ошибку при попытке надеть generic предмет', () => {
    const equipment = new Equipment();
    const genericItem = createEquippableItem('g1', 'generic');
    
    expect(() => equipment.equip(genericItem)).toThrow('Нельзя экипировать предмет типа generic');
  });

  it('должен успешно снимать предмет', () => {
    const equipment = new Equipment();
    const helmet = createEquippableItem('h1', 'helmet');
    equipment.equip(helmet);
    
    const removed = equipment.unequip('helmet');
    
    expect(removed).toBe(helmet);
    expect(equipment.getSlot('helmet')).toBeNull();
  });

  it('должен возвращать null при снятии предмета из пустого слота', () => {
    const equipment = new Equipment();
    expect(equipment.unequip('helmet')).toBeNull();
  });

  it('должен корректно рассчитывать суммарные характеристики (stats)', () => {
    const equipment = new Equipment();
    const sword = createEquippableItem('s1', 'weapon', { strength: 5, agility: 2, intelligence: 0, constitution: 0 });
    const armor = createEquippableItem('a1', 'armor', { strength: 0, agility: 0, intelligence: 0, constitution: 10 });
    
    equipment.equip(sword);
    equipment.equip(armor);
    
    const totalStats = equipment.getBonusStats();
    
    expect(totalStats.strength).toBe(5);
    expect(totalStats.agility).toBe(2);
    expect(totalStats.constitution).toBe(10);
    expect(totalStats.intelligence).toBe(0);
  });

  it('должен возвращать нулевые характеристики, если ничего не надето', () => {
    const equipment = new Equipment();
    const totalStats = equipment.getBonusStats();
    
    expect(totalStats.strength).toBe(0);
    expect(totalStats.agility).toBe(0);
    expect(totalStats.intelligence).toBe(0);
    expect(totalStats.constitution).toBe(0);
  });
});
