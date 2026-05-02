export default function ActionPanel({ actions }: { actions: { key:string;label:string;icon:string;cost:string;disabled:boolean;onClick:()=>void; }[] }) {
  return <div className="actions">{actions.map(a=><button key={a.key} disabled={a.disabled} onClick={a.onClick}><span>{a.icon}</span>{a.label}<small>{a.cost}</small></button>)}</div>;
}
