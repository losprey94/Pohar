interface Props {
  open: boolean;
  onClose: () => void;
  settings: { sound: boolean; reducedAnimations: boolean };
  toggle: (key: 'sound' | 'reducedAnimations') => void;
  reset: () => void;
}

export default function SettingsPanel({ open, onClose, settings, toggle, reset }: Props) {
  if (!open) return null;

  return (
    <div className="overlay">
      <h3>Settings</h3>
      <button onClick={() => toggle('sound')}>Sound: {settings.sound ? 'On' : 'Off'}</button>
      <button onClick={() => toggle('reducedAnimations')}>
        Reduced animation: {settings.reducedAnimations ? 'On' : 'Off'}
      </button>
      <button onClick={reset}>Reset progress</button>
      <button disabled>Rare Spore (Rewarded Ad Soon)</button>
      <button disabled>Gentle Rain Boost (Rewarded Ad Soon)</button>
      <p>v0.2.0</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
