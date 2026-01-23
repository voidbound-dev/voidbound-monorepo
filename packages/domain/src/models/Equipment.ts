import { SlotType, BaseStats } from '@voidbound/shared';
import { Item } from './Item';

/**
 * Агрегат экипировки.
 * Управляет надетыми предметами персонажа.
 */
export class Equipment {
  private _slots: Map<SlotType, Item | null> = new Map();

  constructor() {
    // Инициализируем все возможные слоты как пустые, кроме 'generic'
    this.initSlots();
  }

  private initSlots(): void {
    const equippableSlots: SlotType[] = ['weapon', 'armor', 'helmet', 'boots', 'accessory'];
    equippableSlots.forEach(slot => this._slots.set(slot, null));
  }

  /**
   * Возвращает предмет в конкретном слоте.
   */
  public getSlot(slot: SlotType): Item | null {
    return this._slots.get(slot) || null;
  }

  /**
   * Надевает предмет в соответствующий слот.
   * @param item Предмет для экипировки.
   * @returns Предыдущий предмет из этого слота или null.
   * @throws Error если предмет типа 'generic'.
   */
  public equip(item: Item): Item | null {
    if (item.slotType === 'generic') {
      throw new Error('Нельзя экипировать предмет типа generic');
    }

    const previousItem = this.getSlot(item.slotType);
    this._slots.set(item.slotType, item);
    
    return previousItem;
  }

  /**
   * Снимает предмет из указанного слота.
   * @param slot Тип слота.
   * @returns Снятый предмет или null.
   */
  public unequip(slot: SlotType): Item | null {
    const item = this.getSlot(slot);
    if (item) {
      this._slots.set(slot, null);
    }
    return item;
  }

  /**
   * Рассчитывает суммарные бонусные характеристики от всей экипировки.
   */
  public getBonusStats(): BaseStats {
    const totalStats: BaseStats = {
      strength: 0,
      agility: 0,
      intelligence: 0,
      constitution: 0,
      health: 0,
      maxHealth: 0,
      mana: 0,
      maxMana: 0,
      speed: 0
    };

    this._slots.forEach(item => {
      if (item && item.stats) {
        totalStats.strength += item.stats.strength || 0;
        totalStats.agility += item.stats.agility || 0;
        totalStats.intelligence += item.stats.intelligence || 0;
        totalStats.constitution += item.stats.constitution || 0;
        totalStats.health += item.stats.health || 0;
        totalStats.maxHealth += item.stats.maxHealth || 0;
        totalStats.mana += item.stats.mana || 0;
        totalStats.maxMana += item.stats.maxMana || 0;
        totalStats.speed += item.stats.speed || 0;
      }
    });

    return totalStats;
  }
}
