export type ObjectType =
  | 'moss_patch' | 'small_mushroom' | 'tall_mushroom' | 'tiny_plant' | 'fern' | 'tiny_bug'
  | 'glowing_spore' | 'small_stone' | 'root' | 'dew_drop';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Magical';

export interface TerrariumObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  scale: number;
  tint: number;
  flip: boolean;
  glow: boolean;
  growthStage: number;
}

export const COLLECTION = [
  { key: 'Moss', rarity: 'Common' }, { key: 'Redcap Mushroom', rarity: 'Common' },
  { key: 'Glowshroom', rarity: 'Rare' }, { key: 'Tiny Fern', rarity: 'Uncommon' },
  { key: 'Dewleaf', rarity: 'Uncommon' }, { key: 'Rootling Bug', rarity: 'Rare' },
  { key: 'Golden Spore', rarity: 'Magical' }, { key: 'Nightcap Mushroom', rarity: 'Rare' },
  { key: 'Crystal Moss', rarity: 'Magical' }, { key: 'Firefly Sprout', rarity: 'Magical' }
] as const;
