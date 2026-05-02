import { useEffect, useMemo, useState } from 'react';
import ResourceBar from './components/ResourceBar';
import TerrariumView from './components/TerrariumView';
import ActionPanel from './components/ActionPanel';
import ResearchPanel from './components/ResearchPanel';
import CollectionPanel from './components/CollectionPanel';
import SettingsPanel from './components/SettingsPanel';
import OfflineProgressPopup from './components/OfflineProgressPopup';
import { COLLECTION, type ObjectType } from './game/objectDefinitions';
import { COSTS } from './game/balance';
import { computeProduction, getLevel, newGame, spawnObject, type GameState, type ResKey } from './game/gameState';
import { clearSave, loadGame, saveGame } from './game/saveSystem';
import { RESEARCH } from './game/upgrades';
import type { ResearchNodeView } from './types';

type Cost = Partial<Record<ResKey, number>>;

export default function App() {
  const [game, setGame] = useState<GameState>(() => loadGame() ?? newGame());
  const [panel, setPanel] = useState('');
  const [offline, setOffline] = useState<Record<ResKey, number> | null>(null);
  const prod = useMemo(() => computeProduction(game), [game]);

  useEffect(() => {
    const now = Date.now();
    const elapsed = Math.min((now - game.lastActive) / 1000, 60 * 60 * 8);
    if (elapsed > 5) {
      const p = computeProduction(game);
      setOffline({ water: 0, light: p.light * elapsed, life: p.life * elapsed, spores: p.spores * elapsed });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGame((g) => {
        const p = computeProduction(g);
        const dt = 0.2;
        const totalLifeGenerated = g.totalLifeGenerated + p.life * dt;
        const next = {
          ...g,
          resources: {
            ...g.resources,
            light: g.resources.light + p.light * dt,
            life: g.resources.life + p.life * dt,
            spores: g.resources.spores + p.spores * dt
          },
          totalLifeGenerated,
          terrariumLevel: getLevel(totalLifeGenerated),
          lastActive: Date.now()
        };
        saveGame(next);
        return next;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const canAfford = (cost: Cost) => Object.entries(cost).every(([k, v]) => game.resources[k as ResKey] >= (v ?? 0) * (game.research.gentleGrowth ? 0.9 : 1));
  const spend = (cost: Cost) => {
    setGame((g) => {
      const mult = g.research.gentleGrowth ? 0.9 : 1;
      const resources = { ...g.resources };
      Object.entries(cost).forEach(([k, v]) => {
        resources[k as ResKey] -= (v ?? 0) * mult;
      });
      return { ...g, resources };
    });
  };

  const addObject = (type: ObjectType, countKey: string, discover?: string) => {
    setGame((g) => ({
      ...g,
      objects: [...g.objects, spawnObject(type, 0.08 + (g.research.rareMutation ? 0.08 : 0))],
      counts: { ...g.counts, [countKey]: (g.counts[countKey] ?? 0) + 1 },
      discovered: discover && !g.discovered.includes(discover) ? [...g.discovered, discover] : g.discovered
    }));
  };

  const researchItems: ResearchNodeView[] = RESEARCH.map((r) => ({
    ...r,
    done: !!game.research[r.id],
    can: game.resources.spores >= r.cost,
    onBuy: () => setGame((g) => ({ ...g, resources: { ...g.resources, spores: g.resources.spores - r.cost }, research: { ...g.research, [r.id]: true } }))
  }));

  const actions = [
    { key: 'water', label: 'Tap Water', icon: '💧', cost: '+Water', disabled: false, onClick: () => setGame((g) => ({ ...g, resources: { ...g.resources, water: g.resources.water + 4 * (g.research.humidityBoost ? 1.3 : 1) * (Date.now() < g.rainUntil ? 1.8 : 1) } })) },
    { key: 'moss', label: 'Grow Moss', icon: '🌿', cost: '14W', disabled: !canAfford(COSTS.moss), onClick: () => { spend(COSTS.moss); addObject('moss_patch', 'moss', 'Moss'); } },
    { key: 'mushroom', label: 'Grow Mushroom', icon: '🍄', cost: '25W 18Life', disabled: !canAfford(COSTS.mushroom), onClick: () => { spend(COSTS.mushroom); addObject(Math.random() > 0.6 ? 'tall_mushroom' : 'small_mushroom', Math.random() > 0.6 ? 'tallMushroom' : 'mushroom', 'Redcap Mushroom'); } },
    { key: 'plant', label: 'Grow Tiny Plant', icon: '🌱', cost: '20W 18Light', disabled: !canAfford(COSTS.plant), onClick: () => { spend(COSTS.plant); addObject(Math.random() > 0.5 ? 'fern' : 'tiny_plant', 'plant', 'Tiny Fern'); } },
    { key: 'bug', label: 'Add Bug', icon: '🐞', cost: '65Life 45S', disabled: !canAfford(COSTS.bug), onClick: () => { spend(COSTS.bug); addObject('tiny_bug', 'bug', 'Rootling Bug'); } },
    { key: 'lamp', label: 'Upgrade Lamp', icon: '🪔', cost: '38Light 12S', disabled: !canAfford(COSTS.lamp), onClick: () => { spend(COSTS.lamp); setGame((g) => ({ ...g, lampLevel: g.lampLevel + 1 })); } },
    { key: 'rain', label: 'Rain Boost', icon: '🌧️', cost: '20Light', disabled: !canAfford(COSTS.rain), onClick: () => { spend(COSTS.rain); setGame((g) => ({ ...g, rainUntil: Date.now() + 15000 })); } }
  ];

  return (
    <main className="app">
      <ResourceBar resources={game.resources} prod={prod} />
      <TerrariumView objects={game.objects} level={game.terrariumLevel} rain={Date.now() < game.rainUntil} />
      <div className="side-buttons">
        <button onClick={() => setPanel('research')}>🧪</button>
        <button onClick={() => setPanel('collection')}>📖</button>
        <button onClick={() => setPanel('settings')}>⚙️</button>
      </div>
      <ActionPanel actions={actions} />
      <ResearchPanel open={panel === 'research'} onClose={() => setPanel('')} items={researchItems} />
      <CollectionPanel open={panel === 'collection'} onClose={() => setPanel('')} rows={COLLECTION} discovered={game.discovered} />
      <SettingsPanel open={panel === 'settings'} onClose={() => setPanel('')} settings={game.settings} toggle={(k) => setGame((g) => ({ ...g, settings: { ...g.settings, [k]: !g.settings[k] } }))} reset={() => { clearSave(); setGame(newGame()); }} />
      <OfflineProgressPopup gains={offline} onClaim={() => { if (!offline) return; setGame((g) => ({ ...g, resources: { water: g.resources.water + offline.water, light: g.resources.light + offline.light, life: g.resources.life + offline.life, spores: g.resources.spores + offline.spores } })); setOffline(null); }} />
    </main>
  );
}
