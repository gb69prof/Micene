# DECISIONS — Step 12–15

| ID | Decisione applicata | Motivo / prova |
|---|---|---|
| D12-01 | React 19.2.8 + Vite 8.1.5 + TypeScript strict | Stack vincolante dello Step 11 |
| D12-02 | TypeScript 6.0.3 | TypeScript 7.0.2 risultava incompatibile con `typescript-eslint` 8.65.0; scelta dell’ultima versione stabile compatibile |
| D12-03 | Babylon.js 9.17.1 dietro `EngineAdapter` imperativo | Nessun oggetto Babylon nello store o nei record scientifici |
| D12-04 | WebGL2 obbligatorio; fallback 2D altrimenti | Baseline compatibile con il mandato; WebGPU non richiesto |
| D12-05 | MYS X/Y/Z convertiti nell’adattatore verso gli assi interni Babylon | X=Est, Y=Nord, Z=alto restano l’interfaccia semantica |
| D12-06 | `DEBUG_DISPLAY` separato da `projectTransform` | Le posizioni dei volumi non acquisiscono valore metrico |
| D12-07 | Registry Zod + JSON Schema + validatore di build | La build fallisce per record incompleti o promozioni vietate |
| D12-08 | Picking registrato con import ES esplicito di `Culling/ray` | Nei moduli Babylon il side effect non è implicito; test E2E verificato |
| D12-09 | Zustand persistente soltanto per record serializzabili | Camera, selezione, profilo e lingua persistono per valore |
| D12-10 | Scene lazy-loaded e chunk Babylon separato | La home non paga il costo del motore 3D |
| D12-11 | Service worker in modalità `prompt` | Aggiornamento controllato; niente attivazione silenziosa |
| D12-12 | Nessuna runtime cache aggiuntiva | Solo shell e manifest sintetici ammessi; nessun materiale istituzionale |
| D12-13 | Sonda di rete non precachata | Evita il falso “Online” osservato nel browser simulato offline |
| D12-14 | Tablet testato come viewport/touch Chromium simulato | È una simulazione dichiarata, non una prova Safari/iPad |
| D12-15 | Nessuna analytics o telemetria | Vincolo privacy confermato dal responsabile |

Le versioni complete sono registrate in `package-lock.json`; nessuna dipendenza è caricata da CDN a runtime.

## Step 15

| ID | Decisione applicata | Motivo / prova |
|---|---|---|
| D15-01 | Immagine di riferimento usata solo come direzione artistica | Non è una fonte archeologica o metrica |
| D15-02 | HUD sovrapposto e cassetti richiudibili | La scena resta dominante e i controlli tecnici non occupano una colonna fissa |
| D15-03 | Vista 1250 a.C. visibile ma disabilitata | Comunica la struttura futura senza fingere una ricostruzione disponibile |
| D15-04 | Texture, normal map, cielo e terreno generati a runtime | Nessun asset esterno o diritto non verificato entra nella release |
| D15-05 | Profili grafici applicati a DPR e dettagli | Controllo progressivo del carico, con iPad impostato di default su Leggero |
| D15-06 | Mesh unite per feature e dettaglio | Draw call headless ridotte da 422 a 68 mantenendo metadata e picking |
| D15-07 | Manifest risolto tramite `BASE_URL` | Eliminato il 404 osservato sotto `/Micene/` |
| D15-08 | Watermark integrato e permanente | Avvertenza scientifica leggibile senza fascia tecnica invasiva |
