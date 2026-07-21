export function ScientificLegend() {
  return (
    <details className="panel legend-panel">
      <summary>Legenda scientifica</summary>
      <div className="legend-content">
        <section><h3>Categoria tecnica</h3><p><span className="legend-swatch placeholder" /> <strong>PLACEHOLDER</strong> — fuori dalla scala A–D</p></section>
        <section><h3>Attendibilità di proprietà</h3><ul className="compact-list"><li><b>A</b> evidenza diretta</li><li><b>B</b> molto probabile</li><li><b>C</b> plausibile</li><li><b>D</b> congetturale</li></ul></section>
        <section><h3>Natura epistemica</h3><ul className="compact-list"><li>■ DATA</li><li>△ INFERENCE</li><li>◇ HYPOTHESIS</li></ul></section>
        <section><h3>Stato metrico</h3><p><b>M0</b> non determinato · <b>M1</b> orientativo · <b>M2</b> controllato parziale · <b>M3</b> rete controllata</p></section>
      </div>
    </details>
  );
}
