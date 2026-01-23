import { Inventory, Equipment, Item } from '@voidbound/domain';
import { InventoryViewModel } from '../InventoryViewModel';
import { IInputService, InputAction } from '../../IInputService';

class MockInputService implements IInputService {
  private handlers: Map<InputAction, (() => void)[]> = new Map();

  onAction(action: InputAction, callback: () => void): void {
    if (!this.handlers.has(action)) this.handlers.set(action, []);
    this.handlers.get(action)!.push(callback);
  }

  offAction(action: InputAction, callback: () => void): void {
    const actionHandlers = this.handlers.get(action);
    if (actionHandlers) {
      this.handlers.set(action, actionHandlers.filter(h => h !== callback));
    }
  }

  trigger(action: InputAction): void {
    this.handlers.get(action)?.forEach(h => h());
  }
}

describe('InventoryViewModel', () => {
  let inventory: Inventory;
  let equipment: Equipment;
  let inputService: MockInputService;
  let viewModel: InventoryViewModel;

  beforeEach(() => {
    inventory = new Inventory(20, 100);
    equipment = new Equipment();
    inputService = new MockInputService();
    viewModel = new InventoryViewModel(inventory, equipment, inputService);
  });

  it('должен переключать видимость инвентаря при вызове действия OPEN_INVENTORY', () => {
    expect(viewModel.isVisible).toBe(false);
    inputService.trigger(InputAction.OPEN_INVENTORY);
    expect(viewModel.isVisible).toBe(true);
    inputService.trigger(InputAction.OPEN_INVENTORY);
    expect(viewModel.isVisible).toBe(false);
  });

  it('должен экипировать предмет из инвентаря', () => {
    const item = new Item('1', 'Меч', 1, 'weapon');
    inventory.addItem(item);
    
    viewModel.equipItem('1');

    expect(equipment.getSlot('weapon')).toBe(item);
    expect(inventory.getItem('1')).toBeUndefined();
  });

  it('должен возвращать старый предмет в инвентарь при экипировке нового', () => {
    const oldSword = new Item('1', 'Старый меч', 1, 'weapon');
    const newSword = new Item('2', 'Новый меч', 1, 'weapon');
    
    equipment.equip(oldSword);
    inventory.addItem(newSword);

    viewModel.equipItem('2');

    expect(equipment.getSlot('weapon')).toBe(newSword);
    expect(inventory.getItem('1')).toBe(oldSword);
    expect(inventory.getItem('2')).toBeUndefined();
  });

  it('должен снимать предмет в инвентарь', () => {
    const item = new Item('1', 'Меч', 1, 'weapon');
    equipment.equip(item);

    viewModel.unequipItem('weapon');

    expect(equipment.getSlot('weapon')).toBeNull();
    expect(inventory.getItem('1')).toBe(item);
  });
});
