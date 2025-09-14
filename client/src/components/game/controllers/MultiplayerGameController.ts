import { useState } from 'react';
import { GameController, AudioClip } from '../interfaces';
import { useRecording } from '../hooks';

// Multiplayer controller that implements N-round alternating reversed/original system
export const useMultiplayerGameController = (
    gameId: string,
    playerId: string,
    players: { id: string, name: string }[]
): GameController => {
    const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');
    const totalPlayers = players.length;
    const totalRounds = totalPlayers; // Round 1: everyone records, Rounds 2-N: everyone listens+records

    // Multiplayer state - in real app this would come from backend/socket
    const [currentRound, setCurrentRound] = useState(1);
    const [currentPhase, setCurrentPhase] = useState<GameController['currentPhase']>('recording');
    const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
    const [playersFinished, setPlayersFinished] = useState<Set<string>>(new Set());
    const [playersInListening, setPlayersInListening] = useState<Set<string>>(new Set());

    const recording = useRecording();

    // Helper functions
    const getRecordingPlayerForRound = (round: number) => {
        // Round 1: Player 1, Round 2: Player 2, etc.
        return players[(round - 1) % totalPlayers];
    };
    
    const getListeningPlayerForRound = (round: number) => {
        // Round 1: No listening
        if (round === 1) return null;
        
        // Rotation system: Each round, shift the listening assignment
        // This ensures everyone hears everyone else's recordings
        const currentPlayerIndex = players.findIndex(p => p.id === playerId);
        
        // Round 2: listen to player (index - 1)
        // Round 3: listen to player (index - 2) 
        // Round 4: listen to player (index - 3), etc.
        const offset = round - 1; // rounds 2,3,4... → offsets 1,2,3...
        const listenToPlayerIndex = (currentPlayerIndex - offset + totalPlayers) % totalPlayers;
        
        return players[listenToPlayerIndex];
    };
    
    const getCurrentRecordingPlayer = () => getRecordingPlayerForRound(currentRound);
    const getCurrentListeningPlayer = () => getListeningPlayerForRound(currentRound);
    
    
    // Determine if current round should listen to reversed or original audio
    const shouldListenToReversed = () => {
        // Round 1: Initial recording (no listening)
        // Round 2: Listen to reversed of Round 1
        // Round 3: Listen to original of Round 2  
        // Round 4: Listen to reversed of Round 3
        // Pattern: Even rounds = reversed, Odd rounds (>1) = original
        return currentRound > 1 && currentRound % 2 === 0;
    };

    // Helper to suppress gameId unused warning - would be used for backend calls
    void gameId;

    const confirmRecording = async () => {
        if (!recording.recordedAudio) return;

        try {
            // In real app, send recording to backend and get reversed version
            const reversedUrl = await recording.reverseAudio(recording.recordedAudio);
            
            // Add current player to finished set
            const newFinished = new Set(playersFinished);
            newFinished.add(playerId);
            setPlayersFinished(newFinished);

            // Save the audio clip for this round
            const recordingPlayer = getCurrentRecordingPlayer();
            const newClip: AudioClip = {
                playerId: playerId,
                playerName: recordingPlayer?.name || 'Unknown',
                round: currentRound,
                originalUrl: recording.currentAudioUrl || '',
                reversedUrl: reversedUrl,
                isReversed: shouldListenToReversed()
            };
            setAudioClips(prev => [...prev, newClip]);

            // Phase transition logic - everyone moves together
            if (newFinished.size === totalPlayers) {
                // All players finished this round's recording
                if (currentRound >= totalRounds) {
                    // Game complete - go to results
                    setCurrentPhase('results');
                } else {
                    // Move to next round - everyone will listen first, then record
                    setCurrentRound(prev => prev + 1);
                    setCurrentPhase('listening');
                    setPlayersFinished(new Set());
                    setPlayersInListening(new Set());
                }
            }

            recording.resetRecording(recordingTimer);
        } catch (error) {
            console.error('Error in multiplayer recording:', error);
        }
    };

    const rerecord = () => {
        // Reset recording for current player
        recording.resetRecording(recordingTimer);
        // Remove player from finished set so they can re-record
        const newFinished = new Set(playersFinished);
        newFinished.delete(playerId);
        setPlayersFinished(newFinished);
    };

    const nextPhase = () => {
        // Move from listening to recording (re-recording phase)
        if (currentPhase === 'listening') {
            setCurrentPhase('recording-reversed');
            recording.resetRecording(recordingTimer);
            // Add player to listening completed set
            const updatedListening = new Set(playersInListening);
            updatedListening.add(playerId);
            setPlayersInListening(updatedListening);
        }
    };

    const nextRound = () => {
        // This would be handled automatically by confirmRecording logic
        // but keeping for interface compatibility
        if (currentRound < totalRounds) {
            setCurrentRound(prev => prev + 1);
            setCurrentPhase('recording');
            setPlayersFinished(new Set());
            setPlayersInListening(new Set());
            recording.resetRecording(recordingTimer);
        }
    };

    const backToHome = () => {
        // Navigate back to lobby or home
        window.location.href = '/online-multiplayer/room';
    };

    // Determine which audio URL to use for listening phase
    const getListeningAudioUrl = () => {
        if (currentRound === 1) return null; // No listening in first round
        
        // Find the audio clip from the player this current player should listen to
        const listeningToPlayer = getCurrentListeningPlayer();
        if (!listeningToPlayer) return null;
        
        const previousRoundClip = audioClips.find(clip => 
            clip.round === currentRound - 1 && clip.playerId === listeningToPlayer.id
        );
        if (!previousRoundClip) return null;
        
        return shouldListenToReversed() ? previousRoundClip.reversedUrl : previousRoundClip.originalUrl;
    };

    // Determine current player's status - everyone moves together
    const getPlayerStatus = () => {
        if (currentRound === 1) {
            // Round 1: Everyone records simultaneously (no listening)
            return { canRecord: true, canListen: false, phase: 'recording' as const };
        } else {
            // Round 2+: Everyone listens first, then everyone records
            if (currentPhase === 'listening') {
                return { canRecord: false, canListen: true, phase: 'listening' as const };
            } else {
                // recording-reversed phase
                return { canRecord: true, canListen: false, phase: 'recording-reversed' as const };
            }
        }
    };

    const playerStatus = getPlayerStatus();
    const effectivePhase = currentPhase === 'recording' || currentPhase === 'recording-reversed' 
        ? (playerStatus.canRecord ? currentPhase : 'listening')
        : currentPhase;

    return {
        // State
        currentPhase: effectivePhase,
        currentPlayer: 'player1', // All players are active in sync model
        player1Name: `Round ${currentRound}`,
        player2Name: currentRound > 1 ? `Listening to: ${getCurrentListeningPlayer()?.name || 'Previous Player'}` : '',
        timeLeft: recording.timeLeft,
        maxTime: recordingTimer,
        isRecording: recording.isRecording,
        recordedAudio: recording.recordedAudio,
        currentAudioUrl: recording.currentAudioUrl,
        currentReversedUrl: getListeningAudioUrl() || null, // Use the audio they should listen to
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
