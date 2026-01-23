import { Inventory } from '../models/Inventory';

/**
 * Интерфейс репозитория для работы с инвентарем.
 */
export interface IInventoryRepository {
  /**
   * Сохраняет инвентарь игрока.
   * @param playerId ID игрока.
   * @param inventory Объект инвентаря.
   */
  save(playerId: string, inventory: Inventory): Promise<void>;

  /**
   * Загружает инвентарь игрока.
   * @param playerId ID игрока.
   * @returns Инвентарь или null, если не найден.
   */
  load(playerId: string): Promise<Inventory | null>;
}
