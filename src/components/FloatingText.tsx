export default function FloatingText({ text, x, y }: { text: string; x: number; y: number }) {
  return <div className="floating-text" style={{ left: `${x}%`, top: `${y}%` }}>{text}</div>;
}
