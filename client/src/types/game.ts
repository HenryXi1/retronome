export interface GameRoom {
  id: string;
  code: string;
  players: Player[];
  gameMode: GameMode;
  status: GameStatus;
  currentRound: number;
  maxRounds: number;
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  currentAudio?: AudioClip;
}

export interface AudioClip {
  id: string;
  playerId: string;
  originalUrl?: string;
  reversedUrl?: string;
  round: number;
  timestamp: Date;
  duration: number;
}

export type GameMode = 'local' | 'online-1v1' | 'online-multiplayer';

export type GameStatus = 'waiting' | 'recording' | 'processing' | 'guessing' | 'results' | 'finished';

export interface GameState {
  currentMode: GameMode;
  room?: GameRoom;
  currentPlayer?: Player;
  audioClips: AudioClip[];
  gameFlow: GameFlowStep[];
}

export interface GameFlowStep {
  id: string;
  type: 'record' | 'reverse' | 'guess' | 'reveal';
  playerId: string;
  audioClipId?: string;
  guess?: string;
  isCorrect?: boolean;
  timestamp: Date;
}
