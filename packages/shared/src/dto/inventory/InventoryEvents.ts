import { ItemData } from '../../models/ItemTypes';
import { SocketEvent } from '../SocketEvent';

/**
 * Типы событий инвентаря.
 */
export enum InventoryEventType {
  ITEM_ADDED = 'inventory:item_added',
  ITEM_REMOVED = 'inventory:item_removed',
  INVENTORY_SYNC = 'inventory:sync',
}

/**
 * Полезная нагрузка для полной синхронизации инвентаря.
 */
export interface InventorySyncPayload {
  readonly items: ItemData[];
  readonly capacity: number;
  readonly maxWeight: number;
}

/**
 * Полезная нагрузка для события добавления предмета.
 */
export interface ItemEventPayload {
  readonly item: ItemData;
}

/**
 * Полезная нагрузка для события удаления предмета.
 */
export interface ItemRemovedPayload {
  readonly itemId: string;
}

/**
 * Событие полной синхронизации инвентаря.
 */
export type InventorySyncEvent = SocketEvent<InventorySyncPayload>;

/**
 * Событие добавления предмета.
 */
export type ItemAddedEvent = SocketEvent<ItemEventPayload>;

/**
 * Событие удаления предмета.
 */
export type ItemRemovedEvent = SocketEvent<ItemRemovedPayload>;
