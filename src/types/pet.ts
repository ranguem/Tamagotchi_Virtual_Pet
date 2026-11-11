export type PetStage = 'EGG' | 'BABY' | 'CHILD' | 'TEEN' | 'ADULT';

export type AdultForm = 'ANGEL' | 'NINJA' | 'CHEF' | 'DRAGON';

export interface PetStats {
  hunger: number; // 0 (starving) - 100 (full)
  happiness: number; // 0 (depressed) - 100 (ecstatic)
  cleanliness: number; // 0 (dirty) - 100 (squeaky clean)
  energy: number; // 0 (exhausted) - 100 (energetic)
}

export interface PetData {
  name: string;
  stage: PetStage;
  adultForm?: AdultForm;
  eggType: 'classic' | 'star' | 'dino';
  stats: PetStats;
  level: number;
  exp: number;
  maxExp: number;
  ageDays: number;
  weightG: number;
  poopCount: number;
  isSleeping: boolean;
  isSick: boolean;
  bornTimestamp: number;
  totalInteractions: number;
  gamesWon: number;
}

export type ActiveAction = 
  | 'NONE'
  | 'EATING'
  | 'BATHING'
  | 'PLAYING'
  | 'SLEEPING'
  | 'MEDICINE'
  | 'PETTING'
  | 'LEVEL_UP';

export type MiniGameType = 'GUESS' | 'CATCH';

export type ShellColor = 'teal' | 'pink' | 'yellow' | 'purple' | 'black' | 'cream';

export type LcdColorTheme = 'classic-green' | 'amber-lcd' | 'gameboy-grey' | 'cyber-blue';
