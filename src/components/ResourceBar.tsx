import type { ResKey } from '../game/gameState';
const icon: Record<ResKey, string> = { water: '💧', light: '✨', life: '🌿', spores: '🫧' };
export default function ResourceBar({ resources, prod }: { resources: Record<ResKey, number>; prod: Record<ResKey, number> }) {
  return <div className="resource-bar">{(Object.keys(resources) as ResKey[]).map((k) => <div className="pill" key={k}><span>{icon[k]} {Math.floor(resources[k])}</span><small>{prod[k].toFixed(2)}/s</small></div>)}</div>;
}
