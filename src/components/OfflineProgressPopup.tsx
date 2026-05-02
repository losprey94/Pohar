import type { ResKey } from '../game/gameState';

interface Props {
  gains: Record<ResKey, number> | null;
  onClaim: () => void;
}

export default function OfflineProgressPopup({ gains, onClaim }: Props) {
  if (!gains) return null;

  return (
    <div className="overlay">
      <h3>While you were away</h3>
      <p>
        💧+{Math.floor(gains.water)} ✨+{Math.floor(gains.light)} 🌿+{Math.floor(gains.life)} 🫧+
        {Math.floor(gains.spores)}
      </p>
      <button onClick={onClaim}>Claim</button>
      <button disabled>Double Offline Rewards (Soon)</button>
    </div>
  );
}
