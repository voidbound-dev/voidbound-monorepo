import { Entity, SlotType, BaseStats } from '@voidbound/shared';

/**
 * Сущность предмета.
 * Предметы в нашей системе неизменяемы.
 */
export class Item implements Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly weight: number,
    public readonly slotType: SlotType,
    public readonly stats?: BaseStats
  ) {
    if (weight < 0) {
      throw new Error('Вес предмета не может быть отрицательным');
    }
  }
}
