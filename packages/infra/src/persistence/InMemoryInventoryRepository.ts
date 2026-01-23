import { IInventoryRepository, Inventory, Item } from '@voidbound/domain';
import { SlotType, BaseStats } from '@voidbound/shared';

/**
 * Интерфейс для хранения данных инвентаря в памяти.
 */
interface InventoryDTO {
  capacity: number;
  maxWeight: number;
  items: Array<{
    id: string;
    name: string;
    weight: number;
    slotType: SlotType;
    stats?: BaseStats;
  }>;
}

/**
 * In-memory реализация репозитория инвентаря.
 */
export class InMemoryInventoryRepository implements IInventoryRepository {
  private storage: Map<string, InventoryDTO> = new Map();

  /**
   * Сохраняет инвентарь, сериализуя его в DTO.
   */
  async save(playerId: string, inventory: Inventory): Promise<void> {
    const dto: InventoryDTO = {
      capacity: inventory.capacity,
      maxWeight: inventory.maxWeight,
      items: inventory.getItems().map(item => ({
        id: item.id,
        name: item.name,
        weight: item.weight,
        slotType: item.slotType,
        stats: item.stats
      }))
    };
    this.storage.set(playerId, dto);
  }

  /**
   * Загружает инвентарь, восстанавливая агрегат из DTO.
   */
  async load(playerId: string): Promise<Inventory | null> {
    const dto = this.storage.get(playerId);
    if (!dto) {
      return null;
    }

    const inventory = new Inventory(dto.capacity, dto.maxWeight);
    for (const itemData of dto.items) {
      const item = new Item(
        itemData.id,
        itemData.name,
        itemData.weight,
        itemData.slotType,
        itemData.stats
      );
      inventory.addItem(item);
    }

    return inventory;
  }
}
