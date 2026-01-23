import React from 'react';
import { Item } from '@voidbound/domain';
import { SlotType } from '@voidbound/shared';
import { ItemSlot } from './ItemSlot';
import styles from './Inventory.module.css';

interface EquipmentSlotsProps {
  getSlot: (slot: SlotType) => Item | null;
  onUnequip: (slot: SlotType) => void;
}

export const EquipmentSlots: React.FC<EquipmentSlotsProps> = ({ getSlot, onUnequip }) => {
  const slots: { type: SlotType; label: string }[] = [
    { type: 'helmet', label: 'Голова' },
    { type: 'armor', label: 'Тело' },
    { type: 'weapon', label: 'Оружие' },
    { type: 'boots', label: 'Ноги' },
    { type: 'accessory', label: 'Амулет' },
  ];

  return (
    <div className={styles.equipment}>
      {slots.map(slot => (
        <div key={slot.type} className={styles.equipRow}>
          <div className={styles.slotLabel}>{slot.label}</div>
          <ItemSlot
            item={getSlot(slot.type)}
            onClick={() => onUnequip(slot.type)}
            label={slot.label}
          />
        </div>
      ))}
    </div>
  );
};
