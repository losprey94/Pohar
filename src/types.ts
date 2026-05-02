export interface ResearchNodeView {
  id: string;
  name: string;
  desc: string;
  cost: number;
  done: boolean;
  can: boolean;
  onBuy: () => void;
}

export interface CollectionEntry {
  key: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Magical';
}
