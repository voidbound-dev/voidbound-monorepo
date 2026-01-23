import { Item } from './Item';

/**
 * Ошибка при переполнении инвентаря по количеству предметов.
 */
export class InventoryFullError extends Error {
  constructor() {
    super('Инвентарь переполнен');
    this.name = 'InventoryFullError';
  }
}

/**
 * Ошибка при превышении максимального веса инвентаря.
 */
export class WeightLimitExceededError extends Error {
  constructor() {
    super('Превышен лимит веса');
    this.name = 'WeightLimitExceededError';
  }
}

/**
 * Агрегат инвентаря.
 * Управляет коллекцией предметов и следит за ограничениями.
 */
export class Inventory {
  private _items: Item[] = [];

  constructor(
    public readonly capacity: number,
    public readonly maxWeight: number
  ) {}

  /**
   * Возвращает список всех предметов в инвентаре.
   */
  public getItems(): ReadonlyArray<Item> {
    return this._items;
  }

  /**
   * Возвращает предмет по его ID.
   */
  public getItem(itemId: string): Item | undefined {
    return this._items.find(item => item.id === itemId);
  }

  /**
   * Общий вес всех предметов в инвентаре.
   */
  public get totalWeight(): number {
    return this._items.reduce((sum, item) => sum + item.weight, 0);
  }

  /**
   * Добавляет предмет в инвентарь.
   * @throws InventoryFullError если нет места по количеству слотов.
   * @throws WeightLimitExceededError если добавление превысит максимальный вес.
   */
  public addItem(item: Item): void {
    if (this._items.length >= this.capacity) {
      throw new InventoryFullError();
    }

    if (this.totalWeight + item.weight > this.maxWeight) {
      throw new WeightLimitExceededError();
    }

    this._items.push(item);
  }

  /**
   * Удаляет предмет из инвентаря по ID.
   * @returns Удаленный предмет.
   * @throws Error если предмет не найден.
   */
  public removeItem(itemId: string): Item {
    const index = this._items.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Предмет не найден');
    }

    const [removedItem] = this._items.splice(index, 1);
    return removedItem;
  }
}
