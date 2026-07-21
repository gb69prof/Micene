import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FallbackPage } from './FallbackPage';

describe('fallback 2D', () => {
  it('spiega progetto e Gate senza mostrare una ricostruzione', () => {
    render(<MemoryRouter><FallbackPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Nessuna falsa ricostruzione/ })).toBeInTheDocument();
    expect(screen.getByText(/P0-MIN resta chiuso/)).toBeInTheDocument();
    expect(screen.getByText(/R04 sospesa/)).toBeInTheDocument();
  });
});
