import { BASE_PROD, LEVEL_THRESHOLDS, STARTING } from './balance';
import type { TerrariumObject } from './objectDefinitions';

export type ResKey = 'water' | 'light' | 'life' | 'spores';
export interface GameState {
  resources: Record<ResKey, number>;
  objects: TerrariumObject[];
  counts: Record<string, number>;
  research: Record<string, boolean>;
  discovered: string[];
  terrariumLevel: number;
  totalLifeGenerated: number;
  rainUntil: number;
  lampLevel: number;
  settings: { sound: boolean; reducedAnimations: boolean };
  lastActive: number;
}

export const newGame = (): GameState => ({
  resources: { ...STARTING }, objects: [], counts: {}, research: {}, discovered: ['Moss'], terrariumLevel: 1,
  totalLifeGenerated: 0, rainUntil: 0, lampLevel: 1, settings: { sound: false, reducedAnimations: false }, lastActive: Date.now()
});

export const getLevel = (life: number) => LEVEL_THRESHOLDS.filter((t) => life >= t).length;

export const computeProduction = (s: GameState) => {
  const c = s.counts;
  const all = 1 + (s.research.ecosystemBalance ? 0.1 : 0) + (s.research.livingGlass ? 0.15 : 0) + c.bug * 0.03;
  const light = (BASE_PROD.light * (1 + (s.lampLevel - 1) * 0.35) * (1 + (s.research.betterLamp ? 0.2 : 0))) * all;
  const life = ((c.moss * 0.32 + c.plant * 0.5) * (1 + c.plant * 0.03) * (1 + (s.research.richSoil ? 0.25 : 0))) * all;
  const spores = ((c.mushroom * 0.25 + c.tallMushroom * 0.38) * (1 + (s.research.sporeBloom ? 0.25 : 0))) * all;
  return { light, life, spores, water: 0 };
};

export const spawnObject = (type: TerrariumObject['type'], rareChance = 0.08): TerrariumObject => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  x: 10 + Math.random() * 80,
  y: 14 + Math.random() * 72,
  scale: 0.75 + Math.random() * 0.8,
  tint: -12 + Math.random() * 24,
  flip: Math.random() > 0.5,
  glow: Math.random() < rareChance,
  growthStage: Math.floor(Math.random() * 3)
});
