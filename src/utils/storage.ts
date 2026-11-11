import { PetData } from '../types/pet';

const STORAGE_KEY = 'tamapet_save_data_v1';

export const createDefaultPet = (name = '쿠키', eggType: 'classic' | 'star' | 'dino' = 'classic'): PetData => ({
  name,
  stage: 'EGG',
  eggType,
  stats: {
    hunger: 70,
    happiness: 80,
    cleanliness: 90,
    energy: 100,
  },
  level: 1,
  exp: 0,
  maxExp: 50,
  ageDays: 0,
  weightG: 5,
  poopCount: 0,
  isSleeping: false,
  isSick: false,
  bornTimestamp: Date.now(),
  totalInteractions: 0,
  gamesWon: 0,
});

export function loadSavedPet(): PetData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PetData;
    // Basic validation
    if (data && typeof data.level === 'number' && data.stats) {
      return data;
    }
  } catch (err) {
    console.error('Failed to parse saved pet data:', err);
  }
  return null;
}

export function savePet(data: PetData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save pet data:', err);
  }
}

export function clearSavedPet(): void {
  localStorage.removeItem(STORAGE_KEY);
}
