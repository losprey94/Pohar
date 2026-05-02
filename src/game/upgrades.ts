export const RESEARCH = [
  { id: 'betterLamp', name: 'Better Lamp', desc: '+20% light/s', cost: 30, type: 'lightMul', value: 0.2 },
  { id: 'richSoil', name: 'Rich Soil', desc: '+25% life from flora', cost: 45, type: 'lifeMul', value: 0.25 },
  { id: 'humidityBoost', name: 'Humidity Boost', desc: '+30% water tap gain', cost: 40, type: 'waterTapMul', value: 0.3 },
  { id: 'sporeBloom', name: 'Spore Bloom', desc: '+25% spores from mushrooms', cost: 55, type: 'sporeMul', value: 0.25 },
  { id: 'ecosystemBalance', name: 'Ecosystem Balance', desc: '+10% all production', cost: 70, type: 'allMul', value: 0.1 },
  { id: 'gentleGrowth', name: 'Gentle Growth', desc: '-10% action costs', cost: 85, type: 'costMul', value: 0.1 },
  { id: 'rareMutation', name: 'Rare Mutation', desc: '+8% rare glow chance', cost: 95, type: 'rareAdd', value: 0.08 },
  { id: 'livingGlass', name: 'Living Glass', desc: '+particles + bonus all', cost: 120, type: 'allMul', value: 0.15 },
] as const;
