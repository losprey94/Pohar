import type { GameState } from './gameState';
const KEY = 'tiny-terra-save-v1';

export const saveGame = (state: GameState) => localStorage.setItem(KEY, JSON.stringify(state));
export const loadGame = (): GameState | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as GameState; } catch { return null; }
};
export const clearSave = () => localStorage.removeItem(KEY);
