import React, { useState, useEffect } from 'react';
import { InventoryViewModel } from '../../../application/inventory/InventoryViewModel';
import { InventoryGrid } from './InventoryGrid';
import { EquipmentSlots } from './EquipmentSlots';
import styles from './Inventory.module.css';

interface InventoryWindowProps {
  viewModel: InventoryViewModel;
}

export const InventoryWindow: React.FC<InventoryWindowProps> = ({ viewModel }) => {
  const [isVisible, setIsVisible] = useState(viewModel.isVisible);
  const [, setTick] = useState(0); // Для форсирования ререндера при изменениях в модели

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(() => {
      setIsVisible(viewModel.isVisible);
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, [viewModel]);

  if (!isVisible) return null;

  return (
    <div className={styles.inventoryWindow}>
      <h2 className={styles.title}>Инвентарь</h2>
      <div className={styles.sections}>
        <section>
          <h3>Снаряжение</h3>
          <EquipmentSlots 
            getSlot={(slot) => viewModel.getSlot(slot)} 
            onUnequip={(slot) => viewModel.unequipItem(slot)} 
          />
        </section>
        <section>
          <h3>Предметы</h3>
          <InventoryGrid 
            items={viewModel.items} 
            onEquip={(id) => viewModel.equipItem(id)} 
            capacity={20} 
          />
        </section>
      </div>
    </div>
  );
};
