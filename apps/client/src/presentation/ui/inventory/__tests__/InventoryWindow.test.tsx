import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryWindow } from '../InventoryWindow';
import { InventoryViewModel } from '../../../../application/inventory/InventoryViewModel';
import { Inventory, Equipment, Item } from '@voidbound/domain';
import { IInputService } from '../../../../application/IInputService';

class MockInputService implements IInputService {
  onAction() {}
  offAction() {}
}

describe('InventoryWindow', () => {
  let inventory: Inventory;
  let equipment: Equipment;
  let viewModel: InventoryViewModel;

  beforeEach(() => {
    inventory = new Inventory(20, 100);
    equipment = new Equipment();
    viewModel = new InventoryViewModel(inventory, equipment, new MockInputService());
  });

  it('не должен отображаться, если isVisible в viewModel равно false', () => {
    const { container } = render(<InventoryWindow viewModel={viewModel} />);
    expect(container.firstChild).toBeNull();
  });

  it('должен отображать заголовок "Инвентарь", когда видим', () => {
    viewModel.toggleVisibility();
    render(<InventoryWindow viewModel={viewModel} />);
    expect(screen.getByText('Инвентарь')).toBeInTheDocument();
  });

  it('должен отображать предметы из инвентаря', () => {
    const item = new Item('1', 'Тестовый предмет', 1, 'generic');
    inventory.addItem(item);
    viewModel.toggleVisibility();
    
    render(<InventoryWindow viewModel={viewModel} />);
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('должен вызывать экипировку при клике на предмет в инвентаре', () => {
    const item = new Item('1', 'Меч', 1, 'weapon');
    inventory.addItem(item);
    viewModel.toggleVisibility();
    
    const equipSpy = jest.spyOn(viewModel, 'equipItem');
    
    render(<InventoryWindow viewModel={viewModel} />);
    
    const itemElement = screen.getByTestId('item-1');
    fireEvent.click(itemElement);
    
    expect(equipSpy).toHaveBeenCalledWith('1');
  });

  it('должен отображать экипированный предмет в соответствующем слоте', () => {
    const item = new Item('1', 'Шлем', 1, 'helmet');
    equipment.equip(item);
    viewModel.toggleVisibility();
    
    render(<InventoryWindow viewModel={viewModel} />);
    
    const items = screen.getAllByText('Шлем');
    expect(items.length).toBeGreaterThan(0);
  });
});
