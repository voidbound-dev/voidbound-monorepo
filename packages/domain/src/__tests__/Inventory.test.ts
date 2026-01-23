import { Item } from '../models/Item';
import { Inventory } from '../models/Inventory';

describe('Агрегат Inventory', () => {
  const createItem = (id: string, weight: number) => new Item(id, `Item ${id}`, weight, 'generic');

  it('должен успешно добавлять предмет', () => {
    const inventory = new Inventory(10, 100);
    const item = createItem('1', 10);
    
    inventory.addItem(item);
    
    expect(inventory.getItems()).toContain(item);
    expect(inventory.totalWeight).toBe(10);
  });

  it('должен выбрасывать ошибку при превышении вместимости (capacity)', () => {
    const inventory = new Inventory(1, 100);
    inventory.addItem(createItem('1', 10));
    
    expect(() => inventory.addItem(createItem('2', 10))).toThrow('Инвентарь переполнен');
  });

  it('должен выбрасывать ошибку при превышении максимального веса', () => {
    const inventory = new Inventory(10, 50);
    inventory.addItem(createItem('1', 40));
    
    expect(() => inventory.addItem(createItem('2', 20))).toThrow('Превышен лимит веса');
  });

  it('должен успешно удалять предмет по ID', () => {
    const inventory = new Inventory(10, 100);
    const item = createItem('1', 10);
    inventory.addItem(item);
    
    const removedItem = inventory.removeItem('1');
    
    expect(removedItem).toBe(item);
    expect(inventory.getItems()).not.toContain(item);
    expect(inventory.totalWeight).toBe(0);
  });

  it('должен выбрасывать ошибку при удалении несуществующего предмета', () => {
    const inventory = new Inventory(10, 100);
    expect(() => inventory.removeItem('non-existent')).toThrow('Предмет не найден');
  });

  it('должен корректно находить предмет по ID', () => {
    const inventory = new Inventory(10, 100);
    const item = createItem('1', 10);
    inventory.addItem(item);
    
    expect(inventory.getItem('1')).toBe(item);
    expect(inventory.getItem('2')).toBeUndefined();
  });
});
