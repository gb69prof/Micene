# EngineAdapter

`BabylonEngineAdapter` possiede motore, scena, camere, render loop, picking e diagnostica. React riceve soltanto callback e record serializzabili.

La conversione semantica applica:

- MYS X Est → Babylon X;
- MYS Y Nord → Babylon Z;
- MYS Z alto → Babylon Y.

`displayTransform` serve esclusivamente al laboratorio `DEBUG_DISPLAY`. Non viene trasformato in `projectTransform` e non può essere promosso automaticamente.
