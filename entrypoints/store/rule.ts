import { create } from 'zustand';

//css 预设
interface ruleStoreState {
    option: {
        label: string,
        value: string,
        desc: string,
    }[],
    setOption: (option: ruleStoreState['option']) => void,
}

export const useRuleStore = create<ruleStoreState>((set) => ({
    option: [],
    setOption: (option) => set({ option }),
}));