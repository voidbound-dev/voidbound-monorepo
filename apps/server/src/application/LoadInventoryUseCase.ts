import { IInventoryRepository, Inventory } from '@voidbound/domain';

/**
 * Use Case для загрузки инвентаря игрока.
 */
export class LoadInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  /**
   * Выполняет загрузку инвентаря.
   * Если инвентарь не найден, создает новый с параметрами по умолчанию.
   */
  async execute(playerId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.load(playerId);
    
    if (inventory) {
      return inventory;
    }

    // Параметры по умолчанию для нового инвентаря
    const defaultInventory = new Inventory(20, 100);
    await this.inventoryRepository.save(playerId, defaultInventory);
    
    return defaultInventory;
  }
}
