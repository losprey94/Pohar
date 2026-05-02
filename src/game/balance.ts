export const STARTING = { water: 20, light: 20, life: 0, spores: 0 };
export const BASE_PROD = { light: 0.7, life: 0, spores: 0, waterTap: 4 };
export const COSTS = {
  moss: { water: 14 }, mushroom: { water: 25, life: 18 }, plant: { water: 20, light: 18 },
  bug: { life: 65, spores: 45 }, lamp: { light: 38, spores: 12 }, rain: { light: 20 }
};
export const LEVEL_THRESHOLDS = [0, 30, 140, 420, 980];
