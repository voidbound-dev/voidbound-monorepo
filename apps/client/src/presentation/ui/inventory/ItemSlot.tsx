import React from 'react';
import { Item } from '@voidbound/domain';
import styles from './Inventory.module.css';

interface ItemSlotProps {
  item: Item | null;
  onClick: () => void;
  label?: string;
}

export const ItemSlot: React.FC<ItemSlotProps> = ({ item, onClick, label }) => {
  return (
    <div className={styles.itemSlot} onClick={onClick} data-testid={item ? `item-${item.id}` : 'empty-slot'}>
      {item ? (
        <>
          <div className={styles.itemIcon}>{item.name}</div>
          <div className={styles.tooltip}>
            <div>{item.name}</div>
            <div>Вес: {item.weight}</div>
            {item.stats && <div>Характеристики: ...</div>}
          </div>
        </>
      ) : (
        <div className={styles.emptySlot}>{label || 'Пусто'}</div>
      )}
    </div>
  );
};
