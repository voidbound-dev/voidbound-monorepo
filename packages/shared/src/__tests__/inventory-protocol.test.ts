import { 
  InventoryEventType, 
  InventorySyncPayload, 
  ItemEventPayload, 
  ItemRemovedPayload 
} from '../dto/inventory/InventoryEvents';
import { createSocketEvent } from '../dto/SocketEvent';

describe('Протокол синхронизации инвентаря', () => {
  const mockItem = {
    id: 'item-1',
    name: 'Меч Пустоты',
    weight: 5,
    slotType: 'weapon' as const,
  };

  test('должен создавать событие INVENTORY_SYNC с корректной структурой', () => {
    const payload: InventorySyncPayload = {
      items: [mockItem],
      capacity: 20,
      maxWeight: 100,
    };

    const event = createSocketEvent(InventoryEventType.INVENTORY_SYNC, payload);

    expect(event.type).toBe(InventoryEventType.INVENTORY_SYNC);
    expect(event.payload.items).toHaveLength(1);
    expect(event.payload.items[0].id).toBe(mockItem.id);
    expect(event.payload.capacity).toBe(20);
    expect(event.payload.maxWeight).toBe(100);
    expect(event.timestamp).toBeDefined();
  });

  test('должен создавать событие ITEM_ADDED с данными предмета', () => {
    const payload: ItemEventPayload = {
      item: mockItem,
    };

    const event = createSocketEvent(InventoryEventType.ITEM_ADDED, payload);

    expect(event.type).toBe(InventoryEventType.ITEM_ADDED);
    expect(event.payload.item.id).toBe(mockItem.id);
    expect(event.payload.item.name).toBe(mockItem.name);
  });

  test('должен создавать событие ITEM_REMOVED с ID предмета', () => {
    const payload: ItemRemovedPayload = {
      itemId: 'item-1',
    };

    const event = createSocketEvent(InventoryEventType.ITEM_REMOVED, payload);

    expect(event.type).toBe(InventoryEventType.ITEM_REMOVED);
    expect(event.payload.itemId).toBe('item-1');
  });
});
