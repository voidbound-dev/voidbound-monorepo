import { Inventory, Equipment, Item } from '@voidbound/domain';
import { IInputService, InputAction } from '../IInputService';
import { SlotType } from '@voidbound/shared';

export class InventoryViewModel {
  private _isVisible: boolean = false;
  private _subscribers: (() => void)[] = [];

  constructor(
    private inventory: Inventory,
    private equipment: Equipment,
    private inputService: IInputService
  ) {
    this.inputService.onAction(InputAction.OPEN_INVENTORY, this.toggleVisibility.bind(this));
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }

  public get items(): ReadonlyArray<Item> {
    return this.inventory.getItems();
  }

  public getSlot(slot: SlotType): Item | null {
    return this.equipment.getSlot(slot);
  }

  public toggleVisibility(): void {
    this._isVisible = !this._isVisible;
    this.notify();
  }

  public equipItem(itemId: string): void {
    const item = this.inventory.getItem(itemId);
    if (!item) return;

    try {
      this.inventory.removeItem(itemId);
      const previousItem = this.equipment.equip(item);
      
      if (previousItem) {
        this.inventory.addItem(previousItem);
      }
      this.notify();
    } catch (e) {
      // Если не удалось экипировать, возвращаем предмет в инвентарь
      if (this.inventory.getItem(itemId) === undefined) {
          this.inventory.addItem(item);
      }
      console.error('Ошибка экипировки:', e);
    }
  }

  public unequipItem(slot: SlotType): void {
    const item = this.equipment.unequip(slot);
    if (!item) return;

    try {
      this.inventory.addItem(item);
      this.notify();
    } catch (e) {
      // Если инвентарь полон, надеваем обратно
      this.equipment.equip(item);
      console.error('Ошибка при снятии предмета:', e);
    }
  }

  public subscribe(callback: () => void): () => void {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter(s => s !== callback);
    };
  }

  private notify(): void {
    this._subscribers.forEach(s => s());
  }
}
