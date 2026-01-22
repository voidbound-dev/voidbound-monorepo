export interface BaseStats {
  readonly health: number;
  readonly maxHealth: number;
  readonly mana: number;
  readonly maxMana: number;
  readonly speed: number;
}

export const createBaseStats = (
  health: number,
  maxHealth: number,
  mana: number,
  maxMana: number,
  speed: number
): BaseStats => ({
  health,
  maxHealth,
  mana,
  maxMana,
  speed,
});
