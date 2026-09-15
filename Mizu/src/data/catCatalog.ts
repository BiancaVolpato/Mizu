import { CatColor } from '../types';

export interface CatOption { id: CatColor; label: string; swatch: string; accent: string; }
export interface FutureCosmeticSlot { id: 'collar' | 'hat' | 'bowl' | 'companion'; label: string; enabled: false; }

export const catOptions: CatOption[] = [
  { id: 'white', label: 'Branco', swatch: '#F4F0EA', accent: '#D8C4B6' },
  { id: 'black', label: 'Preto', swatch: '#242424', accent: '#3A3937' },
  { id: 'gray', label: 'Cinza', swatch: '#8E918F', accent: '#6F7371' },
  { id: 'orange', label: 'Laranja', swatch: '#D99B5E', accent: '#B8753D' },
  { id: 'siamese', label: 'Siamês', swatch: '#E5D7C8', accent: '#55463F' },
];

export const futureCosmeticSlots: FutureCosmeticSlot[] = [
  { id: 'collar', label: 'Coleiras', enabled: false },
  { id: 'hat', label: 'Chapéus', enabled: false },
  { id: 'bowl', label: 'Tigelas', enabled: false },
  { id: 'companion', label: 'Novos gatos', enabled: false },
];
