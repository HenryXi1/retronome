import { useState } from 'react';
import { GameController, AudioClip, Player } from '../interfaces';
import { useRecording } from '../hooks';

// Example multiplayer controller that implements the same GameController interface
// This would connect to your multiplayer backend/socket system
export const useMultiplayerGameController = (
    gameId: string,
    playerId: string,
    players: { id: string, name: string }[]
): GameController => {
    const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');

    // These would come from your multiplayer state management (Redux, Socket.io, etc.)
    const [currentPhase, setCurrentPhase] = useState<GameController['currentPhase']>('recording');
    const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
    const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
    const [currentReversedUrl, setCurrentReversedUrl] = useState<string | null>(null);

    const recording = useRecording();

    // In multiplayer, you'd get these from your multiplayer state
    const player1Name = players[0]?.name || 'Player 1';
    const player2Name = players[1]?.name || 'Player 2';

    const confirmRecording = async () => {
        if (!recording.recordedAudio) return;

        try {
            // In multiplayer, you'd send the recording to your backend
            // const response = await sendRecordingToBackend(gameId, playerId, recording.recordedAudio);
            // setCurrentPhase(response.nextPhase);
            // setCurrentPlayer(response.nextPlayer);
            // etc.

            // For now, just simulate the local behavior
            const reversedUrl = await recording.reverseAudio(recording.recordedAudio);

            if (currentPhase === 'recording') {
                setCurrentReversedUrl(reversedUrl);
                setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
                setCurrentPhase('listening');
                recording.resetRecording(recordingTimer);
            } else if (currentPhase === 'recording-reversed') {
                setCurrentPhase('results');
                recording.resetRecording(recordingTimer);
            }
        } catch (error) {
            console.error('Error in multiplayer recording:', error);
        }
    };

    const rerecord = () => {
        // In multiplayer, you might need to notify other players
        recording.resetRecording(recordingTimer);
    };

    const nextPhase = () => {
        // In multiplayer, this would trigger a backend call
        if (currentPhase === 'listening') {
            setCurrentPhase('recording-reversed');
            recording.resetRecording(recordingTimer);
        }
    };

    const nextRound = () => {
        // In multiplayer, this would start a new round for all players
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
        setCurrentPhase('recording');
        setCurrentReversedUrl(null);
        recording.resetRecording(recordingTimer);
    };

    const backToHome = () => {
        // In multiplayer, you'd leave the game room
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
