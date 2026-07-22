import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CameraMode = 'first' | 'third';
export type GraphicProfile = 'light' | 'balanced' | 'high';
export interface Vec3Record { x: number; y: number; z: number }
export interface CameraPoseRecord { position: Vec3Record; target: Vec3Record }

interface AppState {
  cameraMode: CameraMode;
  selectedFeatureId: string | null;
  cameraPose: CameraPoseRecord | null;
  graphicProfile: GraphicProfile;
  language: 'it' | 'en';
  setCameraMode: (mode: CameraMode) => void;
  selectFeature: (featureId: string | null) => void;
  setCameraPose: (pose: CameraPoseRecord) => void;
  setGraphicProfile: (profile: GraphicProfile) => void;
  setLanguage: (language: 'it' | 'en') => void;
}

export const useAppStore = create<AppState>()(persist(
  (set) => ({
    cameraMode: 'third',
    selectedFeatureId: null,
    cameraPose: null,
    graphicProfile: /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'light' : 'balanced',
    language: 'it',
    setCameraMode: (cameraMode) => set({ cameraMode }),
    selectFeature: (selectedFeatureId) => set({ selectedFeatureId }),
    setCameraPose: (cameraPose) => set({ cameraPose }),
    setGraphicProfile: (graphicProfile) => set({ graphicProfile }),
    setLanguage: (language) => set({ language })
  }),
  {
    name: 'micene-step14-preferences-v1',
    partialize: ({ cameraMode, selectedFeatureId, cameraPose, graphicProfile, language }) => ({
      cameraMode, selectedFeatureId, cameraPose, graphicProfile, language
    })
  }
));
