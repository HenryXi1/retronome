export type GamePhase = 'setup' | 'recording' | 'listening' | 'recording-reversed' | 'results';
export type Player = 'player1' | 'player2';

export interface AudioClip {
  id?: string;
  player?: Player;
  playerId?: string;
  playerName?: string;
  originalUrl: string;
  reversedUrl?: string;
  timestamp?: Date;
  originalSong?: string;
  guess?: string;
  isCorrect?: boolean;
  round?: number;
  isReversed?: boolean;
}

export interface GameState {
  currentPhase: GamePhase;
  currentPlayer: Player;
  roundStartingPlayer: Player; // Track who started the current round
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
  originalRecordingUrl: string | null;
  reversedAttemptUrl: string | null;
}
