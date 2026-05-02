import type { ResearchNodeView } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  items: ResearchNodeView[];
}

export default function ResearchPanel({ open, onClose, items }: Props) {
  if (!open) return null;

  return (
    <div className="overlay">
      <h3>Research Grove</h3>
      {items.map((i) => (
        <button key={i.id} onClick={i.onBuy} disabled={i.done || !i.can}>
          <strong>{i.name}</strong>
          <small>{i.desc}</small>
          <small>{i.done ? 'Researched' : `${i.cost} spores`}</small>
        </button>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
