import type { CollectionEntry } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  rows: readonly CollectionEntry[];
  discovered: string[];
}

export default function CollectionPanel({ open, onClose, rows, discovered }: Props) {
  if (!open) return null;

  return (
    <div className="overlay">
      <h3>Collection Book</h3>
      <div className="collection-grid">
        {rows.map((r) => {
          const found = discovered.includes(r.key);
          return (
            <div key={r.key} className={`collection-item ${found ? '' : 'locked'}`}>
              <span>{found ? r.key : 'Locked silhouette'}</span>
              <small>{found ? r.rarity : '????'}</small>
            </div>
          );
        })}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
