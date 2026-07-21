import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScientificPanel } from './ScientificPanel';
import { ScientificLegend } from './ScientificLegend';

describe('modalità scientifica strutturale', () => {
  it('espone un PLACEHOLDER tramite featureId e dichiara i NULL', () => {
    render(<ScientificPanel featureId="P0-PH-LG01-VOL" />);
    expect(screen.getByText('Segnaposto astratto LG01')).toBeInTheDocument();
    expect(screen.getByText('P0-PH-LG01-VOL')).toBeInTheDocument();
    expect(screen.getByText(/M0 · coordinate metriche non determinate/)).toBeInTheDocument();
    expect(screen.getByText(/nessun livello attribuito/)).toBeInTheDocument();
    expect(screen.getByText(/nessuna fonte associata/)).toBeInTheDocument();
  });

  it('distingue PLACEHOLDER, A–D, natura epistemica e M0–M3 senza solo colore', () => {
    render(<ScientificLegend />);
    expect(screen.getByText(/fuori dalla scala A–D/)).toBeInTheDocument();
    expect(screen.getByText(/DATA/)).toBeInTheDocument();
    expect(screen.getByText(/INFERENCE/)).toBeInTheDocument();
    expect(screen.getByText(/M3/)).toBeInTheDocument();
  });
});
