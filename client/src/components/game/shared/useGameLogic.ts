import { useState, useRef, useEffect } from 'react';
import { GameState, GamePhase, Player, AudioClip } from './types';

export const useGameLogic = () => {
  const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');

  const [gameState, setGameState] = useState<GameState>({
    currentPhase: 'recording', // Start directly in recording phase
    currentPlayer: 'player1',
    roundStartingPlayer: 'player1', // Track who started this round
    player1Name: localStorage.getItem('player1Name') || 'Player 1',
    player2Name: localStorage.getItem('player2Name') || 'Player 2',
    timeLeft: recordingTimer,
    isRecording: false,
    recordedAudio: null,
    audioClips: [],
    currentAudioUrl: null,
    canRerecord: true,
    originalSong: '',
    currentGuess: '',
    currentReversedUrl: null,
    originalRecordingUrl: null,
    reversedAttemptUrl: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameState.currentPhase === 'recording' && gameState.timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.currentPhase === 'recording') {
      stopRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState.currentPhase, gameState.timeLeft]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Note: Browser typically records as WebM despite the MIME type label
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setGameState(prev => ({
          ...prev,
          recordedAudio: blob,
          currentAudioUrl: URL.createObjectURL(blob),
          isRecording: false
        }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setGameState(prev => ({
        ...prev,
        isRecording: true,
        timeLeft: recordingTimer
      }));
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && gameState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
  };

  // Call the reverse API to get reversed audio
  const reverseAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:8000/reverse/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to reverse audio');
      }

      const reversedBlob = await response.blob();
      return URL.createObjectURL(reversedBlob);
    } catch (error) {
      console.error('Error reversing audio:', error);
      throw error;
    }
  };

  const confirmRecording = async () => {
    if (!gameState.recordedAudio) {
      console.error('No recorded audio to confirm');
      return;
    }

    try {
      // Call the reverse API to get reversed audio
      const reversedUrl = await reverseAudio(gameState.recordedAudio);

      if (gameState.currentPhase === 'recording') {
        // First recording - save original and reversed, switch to other player for listening phase
        setGameState(prev => ({
          ...prev,
          currentPhase: 'listening',
          currentPlayer: prev.currentPlayer === 'player1' ? 'player2' : 'player1', // Switch to other player
          originalRecordingUrl: prev.currentAudioUrl,
          currentReversedUrl: reversedUrl,
          recordedAudio: null,
          currentAudioUrl: null,
          timeLeft: recordingTimer
        }));
      } else if (gameState.currentPhase === 'recording-reversed') {
        // Second recording (attempt) - save attempt and go to results
        const newClip: AudioClip = {
          id: Date.now().toString(),
          player: gameState.currentPlayer,
          originalUrl: gameState.originalRecordingUrl || '',
          reversedUrl: reversedUrl, // This is the reversed version of their attempt
          timestamp: new Date(),
          originalSong: '',
          guess: '',
          isCorrect: false
        };

        setGameState(prev => ({
          ...prev,
          currentPhase: 'results',
          reversedAttemptUrl: reversedUrl,
          audioClips: [...prev.audioClips, newClip],
          recordedAudio: null,
          currentAudioUrl: null
        }));
      }
    } catch (error) {
      console.error('Error confirming recording:', error);
      // Handle error - maybe show a toast or keep user in recording phase
    }
  };

  const rerecord = () => {
    setGameState(prev => ({
      ...prev,
      recordedAudio: null,
      currentAudioUrl: null,
      timeLeft: recordingTimer,
      isRecording: false
    }));
  };

  const nextPhase = () => {
    setGameState(prev => {
      switch (prev.currentPhase) {
        case 'setup':
          return { ...prev, currentPhase: 'recording' };
        case 'listening':
          // User clicked "I'm ready to record" - go to recording-reversed phase
          return {
            ...prev,
            currentPhase: 'recording-reversed',
            recordedAudio: null,
            currentAudioUrl: null,
            timeLeft: recordingTimer
          };
        case 'results':
          return { ...prev, currentPhase: 'setup' };
        default:
          return prev;
      }
    });
  };

  const switchPlayer = () => {
    setGameState(prev => {
      // Switch to the next round starting player (opposite of who started this round)
      const nextStartingPlayer = prev.roundStartingPlayer === 'player1' ? 'player2' : 'player1';
      return {
        ...prev,
        currentPlayer: nextStartingPlayer,
        roundStartingPlayer: nextStartingPlayer,
        currentPhase: 'recording',
        recordedAudio: null,
        currentAudioUrl: null,
        canRerecord: true,
        originalSong: '',
        currentGuess: '',
        currentReversedUrl: null,
        originalRecordingUrl: null,
        reversedAttemptUrl: null,
        timeLeft: recordingTimer
      };
    });
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  return {
    gameState,
    updateGameState,
    startRecording,
    stopRecording,
    playAudio,
    nextPhase,
    switchPlayer,
    confirmRecording,
    rerecord,
    mediaRecorderRef,
    audioRef
  };
};
