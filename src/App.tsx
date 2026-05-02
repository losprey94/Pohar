import { useEffect, useMemo, useState } from 'react';
import ResourceBar from './components/ResourceBar';
import TerrariumView from './components/TerrariumView';
import ActionPanel from './components/ActionPanel';
import ResearchPanel from './components/ResearchPanel';
import CollectionPanel from './components/CollectionPanel';
import SettingsPanel from './components/SettingsPanel';
import OfflineProgressPopup from './components/OfflineProgressPopup';
import { COLLECTION } from './game/objectDefinitions';
import { COSTS } from './game/balance';
import { computeProduction, getLevel, newGame, spawnObject } from './game/gameState';
import { clearSave, loadGame, saveGame } from './game/saveSystem';
import { RESEARCH } from './game/upgrades';

export default function App() {
  const [game, setGame] = useState(loadGame() ?? newGame());
  const [panel, setPanel] = useState('');
  const [offline, setOffline] = useState<any>(null);
  const prod = useMemo(() => computeProduction(game), [game]);
  useEffect(() => {
    const now = Date.now();
    const elapsed = Math.min((now - game.lastActive) / 1000, 60 * 60 * 8);
    if (elapsed > 5) setOffline({ water: 0, light: prod.light * elapsed, life: prod.life * elapsed, spores: prod.spores * elapsed });
  }, []);
  useEffect(() => {
    const t = setInterval(() => setGame((g) => {
      const p = computeProduction(g);
      const dt = 0.2;
      const ng = { ...g, resources: { ...g.resources, light: g.resources.light + p.light * dt, life: g.resources.life + p.life * dt, spores: g.resources.spores + p.spores * dt }, totalLifeGenerated: g.totalLifeGenerated + p.life * dt, terrariumLevel: getLevel(g.totalLifeGenerated), lastActive: Date.now() };
      saveGame(ng); return ng;
    }), 200);
    return () => clearInterval(t);
  }, []);

  const can = (c:any) => Object.entries(c).every(([k,v]) => game.resources[k as keyof typeof game.resources] >= (v as number) * (game.research.gentleGrowth ? 0.9 : 1));
  const spend = (c:any) => setGame(g => { const m = g.research.gentleGrowth ? 0.9 : 1; const r={...g.resources}; Object.entries(c).forEach(([k,v])=>r[k as keyof typeof r]-=(v as number)*m); return {...g, resources:r};});
  const addObj = (type:any, key:string, discover?:string) => setGame(g=>({ ...g, objects:[...g.objects, spawnObject(type, 0.08 + (g.research.rareMutation?0.08:0))], counts:{...g.counts,[key]:(g.counts[key]||0)+1}, discovered: discover && !g.discovered.includes(discover)?[...g.discovered,discover]:g.discovered }));

  const actions = [
    { key:'water', label:'Tap Water', icon:'💧', cost:'+Water', disabled:false, onClick:()=>setGame(g=>({...g,resources:{...g.resources,water:g.resources.water + 4*(g.research.humidityBoost?1.3:1)*(Date.now()<g.rainUntil?1.8:1)}}))},
    { key:'moss', label:'Grow Moss', icon:'🌿', cost:'14W', disabled:!can(COSTS.moss), onClick:()=>{spend(COSTS.moss); addObj('moss_patch','moss','Moss');}},
    { key:'mush', label:'Grow Mushroom', icon:'🍄', cost:'25W 18L', disabled:!can(COSTS.mushroom), onClick:()=>{spend(COSTS.mushroom); addObj(Math.random()>0.6?'tall_mushroom':'small_mushroom',Math.random()>0.6?'tallMushroom':'mushroom','Redcap Mushroom');}},
    { key:'plant', label:'Grow Tiny Plant', icon:'🌱', cost:'20W 18Li', disabled:!can(COSTS.plant), onClick:()=>{spend(COSTS.plant); addObj(Math.random()>0.5?'fern':'tiny_plant','plant','Tiny Fern');}},
    { key:'bug', label:'Add Bug', icon:'🐞', cost:'65Li 45S', disabled:!can(COSTS.bug), onClick:()=>{spend(COSTS.bug); addObj('tiny_bug','bug','Rootling Bug');}},
    { key:'lamp', label:'Upgrade Lamp', icon:'🪔', cost:'38Li 12S', disabled:!can(COSTS.lamp), onClick:()=>{spend(COSTS.lamp); setGame(g=>({...g,lampLevel:g.lampLevel+1}));}},
    { key:'rain', label:'Rain Boost', icon:'🌧️', cost:'20Li', disabled:!can(COSTS.rain), onClick:()=>{spend(COSTS.rain); setGame(g=>({...g,rainUntil:Date.now()+15000}));}},
  ];

  return <main className='app'>
    <ResourceBar resources={game.resources} prod={prod as any} />
    <TerrariumView objects={game.objects} level={game.terrariumLevel} rain={Date.now() < game.rainUntil} />
    <div className='side-buttons'><button onClick={()=>setPanel('research')}>🧪</button><button onClick={()=>setPanel('collection')}>📖</button><button onClick={()=>setPanel('settings')}>⚙️</button></div>
    <ActionPanel actions={actions} />
    <ResearchPanel open={panel==='research'} onClose={()=>setPanel('')} items={RESEARCH.map(r=>({ ...r, done:game.research[r.id], can: game.resources.spores >= r.cost, onBuy:()=>setGame(g=>({...g,resources:{...g.resources,spores:g.resources.spores-r.cost},research:{...g.research,[r.id]:true}})) }))} />
    <CollectionPanel open={panel==='collection'} onClose={()=>setPanel('')} rows={COLLECTION} discovered={game.discovered} />
    <SettingsPanel open={panel==='settings'} onClose={()=>setPanel('')} settings={game.settings} toggle={(k:any)=>setGame(g=>({...g,settings:{...g.settings,[k]:!g.settings[k]}}))} reset={()=>{clearSave(); setGame(newGame());}} />
    <OfflineProgressPopup gains={offline} onClaim={()=>{setGame(g=>({...g,resources:{water:g.resources.water+offline.water,light:g.resources.light+offline.light,life:g.resources.life+offline.life,spores:g.resources.spores+offline.spores}})); setOffline(null);}} />
  </main>;
}
