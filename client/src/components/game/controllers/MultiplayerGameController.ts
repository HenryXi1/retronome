import { useState, useEffect } from 'react';
import { GameController } from '../interfaces';
import { useRecording } from '../hooks';
import { useWebSocket } from '../../../contexts/WebSocketContext';

// Multiplayer controller that implements server-driven round system
export const useMultiplayerGameController = (): GameController => {
    const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');
    const { sendMessage, addMessageHandler } = useWebSocket();

    // Server-synchronized state
    const [currentRound, setCurrentRound] = useState(1);
    const [currentPhase, setCurrentPhase] = useState<GameController['currentPhase']>('recording');
    const [gameSummaryFiles, setGameSummaryFiles] = useState<any[][][]>([]);
    const [roundInProgress, setRoundInProgress] = useState(true);
    const [currentReversedAudioUrl, setCurrentReversedAudioUrl] = useState<string | null>(null);

    const recording = useRecording();

    // Helper function to convert base64 to playable audio URL
    const createAudioUrlFromBase64 = (base64Data: string) => {
        try {
            // Convert base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Create blob and URL
            const blob = new Blob([bytes], { type: 'audio/webm' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error creating audio URL from base64:', error);
            return null;
        }
    };

    // Helper function to process game summary files and convert base64 to URLs
    const processGameSummaryFiles = (files: any[][]) => {
        return files.map(playerRounds => 
            playerRounds.map(([playerId, originalFile, reversedFile]) => [
                playerId,
                originalFile ? createAudioUrlFromBase64(originalFile) : null,
                reversedFile ? createAudioUrlFromBase64(reversedFile) : null
            ])
        );
    };

    // WebSocket message handlers
    useEffect(() => {
        const handleMessage = (response: any) => {
            console.log('🎮 MultiplayerGameController received message:', response);
            switch (response.type) {
                case 'game_round':
                    const roundNumber = response.round_number;
                    const audioBase64 = response.audio;
                    
                    console.log('🎮 Received game_round:', roundNumber);
                    console.log('🎮 Audio base64 length:', audioBase64?.length);
                    
                    // Convert base64 audio to playable URL (this is the reversed audio)
                    if (audioBase64) {
                        const reversedAudioUrl = createAudioUrlFromBase64(audioBase64);
                        setCurrentReversedAudioUrl(reversedAudioUrl);
                    } else {
                        setCurrentReversedAudioUrl(null);
                    }
                    
                    setCurrentRound(roundNumber);
                    setRoundInProgress(true);
                    
                    // First round: go to recording (no audio clips to listen to)
                    // Subsequent rounds: go to listening (audio clips available)
                    if (roundNumber === 1) {
                        console.log('🎮 Starting recording phase for round 1');
                        setCurrentPhase('recording');
                        recording.resetRecording(recordingTimer);
                    } else {
                        console.log('🎮 Starting listening phase for round', roundNumber);
                        setCurrentPhase('listening');
                    }
                    break;
                    
                case 'game_summary':
                    setCurrentPhase('results');
                    // Process the 2D array and convert base64 to URLs
                    console.log('🎮 Received game summary files:', response.files);
                    const processedFiles = processGameSummaryFiles(response.files || []);
                    console.log('🎮 Processed files with URLs:', processedFiles);
                    setGameSummaryFiles(processedFiles);
                    setRoundInProgress(false);
                    break;
                    
                default:
                    break;
            }
        };

        const cleanup = addMessageHandler(handleMessage);
        return () => {
            cleanup();
        };
    }, [addMessageHandler, recordingTimer, recording]);


    const confirmRecording = async () => {
        if (!recording.recordedAudio) {
            console.warn('🎤 No recorded audio available');
            return;
        }
        
        if (!roundInProgress) {
            console.warn('🎤 Round not in progress');
            return;
        }

        try {
            // Convert blob to base64 for transmission
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    const base64Audio = reader.result as string;
                    
                    if (!base64Audio || !base64Audio.includes(',')) {
                        console.error('🎤 Invalid base64 audio data');
                        return;
                    }
                    
                    // Send recording to server
                    const message = {
                        type: 'upload_file',
                        round_number: currentRound,
                        file_data: base64Audio.split(',')[1], // Remove data:audio/wav;base64, prefix
                    };
                    
                    sendMessage(message);
                } catch (error) {
                    console.error('🎤 Error processing audio data:', error);
                }
            };
            
            reader.onerror = (error) => {
                console.error('🎤 FileReader error:', error);
            };
            
            reader.readAsDataURL(recording.recordedAudio);
            recording.resetRecording(recordingTimer);
            
        } catch (error) {
            console.error('🎤 Error in confirmRecording:', error);
        }
    };

    const rerecord = () => {
        // Reset recording for current player - server will handle state
        recording.resetRecording(recordingTimer);
    };

    const nextPhase = () => {
        // Transition from listening to recording-reversed (client-side)
        if (currentPhase === 'listening') {
            setCurrentPhase('recording-reversed');
            recording.resetRecording(recordingTimer);
        }
    };

    const nextRound = () => {
        // Server handles round transitions automatically
        // This is kept for interface compatibility
    };

    const backToHome = () => {
        // Navigate back to lobby or home
        window.location.href = '/online-multiplayer/room';
    };


    return {
        // State
        currentPhase,
        currentPlayer: 'player1', // All players are active in sync model
        timeLeft: recording.timeLeft,
        maxTime: recordingTimer,
        isRecording: recording.isRecording,
        recordedAudio: recording.recordedAudio,
        currentAudioUrl: recording.currentAudioUrl,
        currentReversedUrl: currentReversedAudioUrl,
        audioClips: [], // Empty for multiplayer - using gameSummaryFiles instead
        gameSummaryFiles,

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
