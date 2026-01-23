import { Inventory, Item } from '@voidbound/domain';
import { InMemoryInventoryRepository } from '../InMemoryInventoryRepository';

describe('InMemoryInventoryRepository', () => {
  let repository: InMemoryInventoryRepository;
  const playerId = 'player-1';

  beforeEach(() => {
    repository = new InMemoryInventoryRepository();
  });

  it('должен сохранять и возвращать инвентарь игрока', async () => {
    const inventory = new Inventory(10, 100);
    const item = new Item('item-1', 'Sword', 5, 'weapon');
    inventory.addItem(item);

    await repository.save(playerId, inventory);
    const loadedInventory = await repository.load(playerId);

    expect(loadedInventory).toBeDefined();
    expect(loadedInventory?.capacity).toBe(10);
    expect(loadedInventory?.maxWeight).toBe(100);
    expect(loadedInventory?.getItems().length).toBe(1);
    expect(loadedInventory?.getItems()[0].id).toBe('item-1');
  });

  it('должен возвращать null, если инвентарь не найден', async () => {
    const loadedInventory = await repository.load('non-existent');
    expect(loadedInventory).toBeNull();
  });

  it('должен перезаписывать существующий инвентарь при повторном сохранении', async () => {
    const inventory1 = new Inventory(10, 100);
    await repository.save(playerId, inventory1);

    const inventory2 = new Inventory(20, 200);
    await repository.save(playerId, inventory2);

    const loadedInventory = await repository.load(playerId);
    expect(loadedInventory?.capacity).toBe(20);
    expect(loadedInventory?.maxWeight).toBe(200);
  });
});
