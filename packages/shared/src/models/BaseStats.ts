/**
 * Интерфейс базовых характеристик персонажа.
 */
export interface BaseStats {
  strength: number;
  agility: number;
  intelligence: number;
  constitution: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  speed: number;
}

/**
 * Фабрика для создания объекта базовых характеристик.
 */
export const createBaseStats = (
  strength: number,
  agility: number,
  intelligence: number,
  constitution: number,
  health: number,
  maxHealth: number,
  mana: number,
  maxMana: number,
  speed: number
): BaseStats => ({
  strength,
  agility,
  intelligence,
  constitution,
  health,
  maxHealth,
  mana,
  maxMana,
  speed,
});
