import type { MoveDirection } from '@/engine/types';

export function TouchControls({ onMove }: { onMove: (direction: MoveDirection) => void }) {
  return (
    <div className="touch-controls" aria-label="Controlli di movimento touch simulabili">
      <button aria-label="Muovi avanti" onClick={() => onMove('forward')}>▲</button>
      <button aria-label="Muovi a sinistra" onClick={() => onMove('left')}>◀</button>
      <button aria-label="Muovi indietro" onClick={() => onMove('back')}>▼</button>
      <button aria-label="Muovi a destra" onClick={() => onMove('right')}>▶</button>
    </div>
  );
}
