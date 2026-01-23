import React from 'react';
import { Item } from '@voidbound/domain';
import { ItemSlot } from './ItemSlot';
import styles from './Inventory.module.css';

interface InventoryGridProps {
  items: ReadonlyArray<Item>;
  onEquip: (id: string) => void;
  capacity: number;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ items, onEquip, capacity }) => {
  const slots = Array.from({ length: capacity }, (_, i) => items[i] || null);

  return (
    <div className={styles.grid}>
      {slots.map((item, index) => (
        <ItemSlot
          key={item ? item.id : `empty-${index}`}
          item={item}
          onClick={() => item && onEquip(item.id)}
        />
      ))}
    </div>
  );
};
