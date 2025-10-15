export type Location = 'menu' | 'corridor' | 'basement' | 'library' | 'attic' | 'bedroom' | 'kitchen' | 'ending';
export type Antagonist = 'dottore' | 'tartaglia' | 'venti' | 'scaramouche' | 'sandrone';
export type EndingType = 'insanity' | 'caught' | 'exhaustion' | 'cursed' | 'sacrifice';
export type Difficulty = 'easy' | 'normal' | 'nightmare';

export interface GameEvent {
  message: string;
  type: 'danger' | 'warning' | 'info' | 'help';
  antagonist?: Antagonist;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GameState {
  currentLocation: Location;
  health: number;
  sanity: number;
  inventory: string[];
  rulesViolated: number;
  discoveredClues: number;
  antagonistActivity: { [key in Antagonist]: boolean };
  timeElapsed: number;
  currentEvent: GameEvent | null;
  ending: EndingType | null;
  isHiding: boolean;
  difficulty: Difficulty;
  achievements: Achievement[];
  soundEnabled: boolean;
}

export interface LocationData {
  id: string;
  name: string;
  icon: string;
  danger: number;
  description: string;
}

export interface AntagonistData {
  id: string;
  name: string;
  threat: string;
  icon: string;
  color: string;
}
