import type { TerrariumObject } from '../game/objectDefinitions';
export default function TerrariumView({ objects, level, rain }: { objects: TerrariumObject[]; level: number; rain: boolean }) {
  return <div className={`jar-wrap lvl-${level}`}><div className="lamp"/><div className="jar">{rain && <div className="rain"/>}<div className="soil"/>{objects.map((o)=><div key={o.id} className={`obj ${o.type} ${o.glow?'rare':''}`} style={{left:`${o.x}%`,top:`${o.y}%`,transform:`scale(${o.flip?-o.scale:o.scale},${o.scale})`,filter:`hue-rotate(${o.tint}deg)`}}/> )}</div></div>;
}
