import { useState } from 'react';
import { GameController, AudioClip, Player } from '../interfaces';
import { useRecording } from '../hooks';

// Local game controller that implements the GameController interface
export const useLocalGameController = (): GameController => {
    // TODO: Implement in later iterations
    const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');

    const [currentPhase, setCurrentPhase] = useState<GameController['currentPhase']>('recording');
    const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
    const [roundStartingPlayer, setRoundStartingPlayer] = useState<Player>('player1');
    const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
    const [currentReversedUrl, setCurrentReversedUrl] = useState<string | null>(null);
    const [originalRecordingUrl, setOriginalRecordingUrl] = useState<string | null>(null);

    const recording = useRecording();

    const player1Name = localStorage.getItem('player1Name') || 'Player 1';
    const player2Name = localStorage.getItem('player2Name') || 'Player 2';

    const confirmRecording = async () => {
        if (!recording.recordedAudio) {
            console.error('No recorded audio to confirm');
            return;
        }

        try {
            const reversedUrl = await recording.reverseAudio(recording.recordedAudio);

            if (currentPhase === 'recording') {
                // First recording - save original and reversed, switch to other player for listening phase
                setOriginalRecordingUrl(recording.currentAudioUrl);
                setCurrentReversedUrl(reversedUrl);
                setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
                setCurrentPhase('listening');
                recording.resetRecording(recordingTimer);
            } else if (currentPhase === 'recording-reversed') {
                // Second recording (attempt) - save attempt and go to results
                const newClip: AudioClip = {
                    id: Date.now().toString(),
                    player: currentPlayer,
                    originalUrl: originalRecordingUrl || '',
                    reversedUrl: reversedUrl,
                    timestamp: new Date(),
                    originalSong: '',
                    guess: '',
                    isCorrect: false
                };

                setAudioClips(prev => [...prev, newClip]);
                setCurrentPhase('results');
                recording.resetRecording(recordingTimer);
            }
        } catch (error) {
            console.error('Error confirming recording:', error);
        }
    };

    const rerecord = () => {
        recording.resetRecording(recordingTimer);
    };

    const nextPhase = () => {
        if (currentPhase === 'listening') {
            // User clicked "I'm ready to record" - go to recording-reversed phase
            setCurrentPhase('recording-reversed');
            recording.resetRecording(recordingTimer);
        }
    };

    const nextRound = () => {
        // Switch to the next round starting player
        const nextStartingPlayer = roundStartingPlayer === 'player1' ? 'player2' : 'player1';
        setCurrentPlayer(nextStartingPlayer);
        setRoundStartingPlayer(nextStartingPlayer);
        setCurrentPhase('recording');
        setCurrentReversedUrl(null);
        setOriginalRecordingUrl(null);
        recording.resetRecording(recordingTimer);
    };

    const backToHome = () => {
        window.location.href = '/';
    };

    return {
        // State
        currentPhase,
        currentPlayer,
        player1Name,
        player2Name,
        timeLeft: recording.timeLeft,
        maxTime: recordingTimer,
        isRecording: recording.isRecording,
        recordedAudio: recording.recordedAudio,
        currentAudioUrl: recording.currentAudioUrl,
        currentReversedUrl,
        audioClips,
        gameSummaryFiles: [],

        // Actions
        startRecording: () => recording.startRecording(recordingTimer),
        stopRecording: recording.stopRecording,
        confirmRecording,
        rerecord,
        nextPhase,
        playAudio: recording.playAudio,
        nextRound,
        backToHome,
    };
};
