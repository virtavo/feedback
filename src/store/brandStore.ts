import { create } from 'zustand';
import type { Brand } from '@/data';

export type Role = '运营' | '开发';

interface BrandStore {
  activeBrand: Brand;
  setActiveBrand: (b: Brand) => void;
  activeRole: Role;
  setActiveRole: (r: Role) => void;
}

export const useBrandStore = create<BrandStore>((set) => ({
  activeBrand: 'VIRTAVO',
  setActiveBrand: (activeBrand) => set({ activeBrand }),
  activeRole: '运营',
  setActiveRole: (activeRole) => set({ activeRole }),
}));
