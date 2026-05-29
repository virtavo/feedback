import { create } from 'zustand';
import type { Brand } from '@/data';

interface BrandStore {
  activeBrand: Brand;
  setActiveBrand: (b: Brand) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  activeBrand: 'VIRTAVO',
  setActiveBrand: (activeBrand) => set({ activeBrand }),
}));
