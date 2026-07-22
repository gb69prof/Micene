export function ScientificLegend() {
  return (
    <section className="panel legend-panel">
      <div className="panel-heading"><span>LEGENDA SCIENTIFICA</span><b>P0-MIN CHIUSO</b></div>
      <div className="legend-content">
        <section><h3>Classificazione di ciò che vedi</h3><ul className="classification-list"><li><span className="legend-swatch documented" /><b>Fonte/documentato</b><small>identità e caratteri generali attestati</small></li><li><span className="legend-swatch inference" /><b>Inferenza visiva</b><small>composizione plausibile, non metrica</small></li><li><span className="legend-swatch aesthetic" /><b>Ipotesi estetica</b><small>atmosfera senza valore archeologico</small></li><li><span className="legend-swatch placeholder" /><b>Placeholder</b><small>geometria tecnica fuori da A–D</small></li></ul></section>
        <section><h3>Attendibilità di proprietà</h3><ul className="compact-list"><li><b>A</b> evidenza diretta</li><li><b>B</b> molto probabile</li><li><b>C</b> plausibile</li><li><b>D</b> congetturale</li></ul></section>
        <section><h3>Natura epistemica</h3><ul className="compact-list"><li>■ DATA</li><li>△ INFERENCE</li><li>◇ HYPOTHESIS</li></ul></section>
        <section><h3>Stato metrico</h3><p><b>M0</b> non determinato · <b>M1</b> orientativo · <b>M2</b> controllato parziale · <b>M3</b> rete controllata</p></section>
      </div>
    </section>
  );
}
