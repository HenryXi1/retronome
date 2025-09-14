import { AudioClip, GamePhase, Player } from './types';

// Generic game controller interface that both Local and Multiplayer can implement
export interface GameController {
    // State
    currentPhase: GamePhase;
    currentPlayer: Player;
    currentRound?: number;
    player1Name?: string;
    player2Name?: string;
    timeLeft: number;
    maxTime: number;
    isRecording: boolean;
    recordedAudio: Blob | null;
    currentAudioUrl: string | null;
    currentReversedUrl: string | null;
    audioClips: AudioClip[];
    gameSummaryFiles?: any[][][];
    playerNames?: Record<string, string>;

    // Recording actions
    startRecording: () => void;
    stopRecording: () => void;
    confirmRecording: () => void;
    rerecord: () => void;

    // Phase actions
    nextPhase: () => void;
    playAudio: (url: string) => void;

    // Round actions
    nextRound: () => void;
    backToHome: () => void;
}
