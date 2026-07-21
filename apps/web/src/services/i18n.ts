import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  it: { translation: {
    appName: 'Micene · laboratorio P0',
    prototype: 'PROTOTIPO TECNICO',
    warning: 'PLACEHOLDER — NON È UNA RICOSTRUZIONE DI MICENE',
    home: 'Quadro iniziale', explorer: 'Esploratore 3D', fallback: 'Fallback 2D',
    openExplorer: 'Apri il laboratorio 3D', gateClosed: 'P0-MIN chiuso',
    firstPerson: 'Prima persona', thirdPerson: 'Terza persona', resetCamera: 'Reset camera',
    diagnostics: 'Diagnostica', scientificLegend: 'Legenda scientifica', selectedFeature: 'Elemento selezionato',
    noSelection: 'Tocca o fai clic su una primitiva astratta per ispezionarne il record.',
    retry: 'Riprova', offline: 'Offline', online: 'Online', update: 'Aggiornamento disponibile', updateNow: 'Aggiorna ora'
  }},
  en: { translation: {
    appName: 'Mycenae · P0 laboratory',
    prototype: 'TECHNICAL PROTOTYPE',
    warning: 'PLACEHOLDER — THIS IS NOT A RECONSTRUCTION OF MYCENAE',
    home: 'Overview', explorer: '3D Explorer', fallback: '2D fallback',
    openExplorer: 'Open the 3D laboratory', gateClosed: 'P0-MIN closed',
    firstPerson: 'First person', thirdPerson: 'Third person', resetCamera: 'Reset camera',
    diagnostics: 'Diagnostics', scientificLegend: 'Scientific legend', selectedFeature: 'Selected feature',
    noSelection: 'Tap or click an abstract primitive to inspect its record.',
    retry: 'Retry', offline: 'Offline', online: 'Online', update: 'Update available', updateNow: 'Update now'
  }}
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'it',
  fallbackLng: 'it',
  interpolation: { escapeValue: false }
});

export default i18n;
