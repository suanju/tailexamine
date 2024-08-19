import { create } from 'zustand';

interface MouseStoreState {
  element :Element | null
  setElement : (element: Element) => void
  lastEvent: MouseEvent
  setLastEvent : (event: MouseEvent) => void
  position: { x: number; y: number };
  setPosition: (x: number, y: number) => void;
  isListeningMouse: boolean;
  setIsListeningMouse: (isListening: boolean) => void;
}

export const useMouseStore = create<MouseStoreState>((set) => ({
  element: null,
  setElement: (element: Element) => set({ element }),
  lastEvent: new MouseEvent("lastEvent"),
  setLastEvent: (event: MouseEvent) => set({ lastEvent: event }),
  position: { x: 0, y: 0 },
  setPosition: (x, y) => set({ position: { x, y } }),
  isListeningMouse: true,
  setIsListeningMouse: (isListening) => set({ isListeningMouse: isListening }),
}));
