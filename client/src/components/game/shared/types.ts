export type GamePhase = 'setup' | 'recording' | 'listening' | 'reversing' | 'guessing' | 'results';
export type Player = 'player1' | 'player2';

export interface AudioClip {
  id: string;
  player: Player;
  originalUrl: string;
  reversedUrl?: string;
  timestamp: Date;
  originalSong?: string;
  guess?: string;
  isCorrect?: boolean;
}

export interface GameState {
  currentPhase: GamePhase;
  currentPlayer: Player;
  player1Name: string;
  player2Name: string;
  timeLeft: number;
  isRecording: boolean;
  recordedAudio: Blob | null;
  audioClips: AudioClip[];
  currentAudioUrl: string | null;
  canRerecord: boolean;
  originalSong: string;
  currentGuess: string;
  currentReversedUrl: string | null;
}
