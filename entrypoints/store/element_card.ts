import { create } from 'zustand';

//element窗口位置
interface ElementCardStoreState {
  elementCardPosition: { top: number; left: number }
  setElementCardPosition: (top: number, left: number) => void;
  isMove: boolean;
  setIsMove: (isMove: boolean) => void;
}

export const useElementCardStore = create<ElementCardStoreState>((set) => ({
  elementCardPosition: { top: 0, left: 0 },
  setElementCardPosition: (top, left) => set({ elementCardPosition: { top, left } }),
  isMove: false,
  setIsMove: (isMove) => set({ isMove })
}));