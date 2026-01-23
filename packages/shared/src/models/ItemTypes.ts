import { Entity } from './Entity';

/**
 * Типы слотов для экипировки.
 */
export type SlotType = 
  | 'weapon' 
  | 'armor' 
  | 'helmet' 
  | 'boots' 
  | 'accessory' 
  | 'generic';

/**
 * Базовый интерфейс данных предмета (DTO).
 */
export interface ItemData extends Entity {
  readonly name: string;
  readonly weight: number;
  readonly slotType: SlotType;
}
