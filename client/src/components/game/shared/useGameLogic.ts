import { useState, useRef, useEffect } from 'react';
import { GameState, GamePhase, Player, AudioClip } from './types';

export const useGameLogic = () => {
  const recordingTimer = parseInt(localStorage.getItem('recordingTimer') || '30');
  
  const [gameState, setGameState] = useState<GameState>({
    currentPhase: 'recording', // Start directly in recording phase
    currentPlayer: 'player1',
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
        const blob = new Blob(chunks, { type: 'audio/wav' });
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

  const reverseAudio = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate audio reversal - in real app, this would be done on backend
      setTimeout(() => {
        const reversedUrl = URL.createObjectURL(audioBlob);
        setGameState(prev => ({ ...prev, currentReversedUrl: reversedUrl }));
        resolve(reversedUrl);
      }, 2000);
    });
  };

  const submitGuess = () => {
    const isCorrect = gameState.currentGuess.toLowerCase().includes(gameState.originalSong.toLowerCase()) ||
                     gameState.originalSong.toLowerCase().includes(gameState.currentGuess.toLowerCase());
    
    const newClip: AudioClip = {
      id: Date.now().toString(),
      player: gameState.currentPlayer,
      originalUrl: gameState.currentAudioUrl || '',
      reversedUrl: gameState.currentReversedUrl || undefined,
      timestamp: new Date(),
      originalSong: gameState.originalSong,
      guess: gameState.currentGuess,
      isCorrect
    };

    setGameState(prev => ({
      ...prev,
      audioClips: [...prev.audioClips, newClip],
      currentPhase: 'results'
    }));
  };

  const nextPhase = () => {
    setGameState(prev => {
      switch (prev.currentPhase) {
        case 'setup':
          return { ...prev, currentPhase: 'recording' };
        case 'recording':
          return { ...prev, currentPhase: 'listening' };
        case 'listening':
          return { ...prev, currentPhase: 'reversing' };
        case 'reversing':
          return { ...prev, currentPhase: 'guessing' };
        case 'guessing':
          return { ...prev, currentPhase: 'results' };
        case 'results':
          return { ...prev, currentPhase: 'setup' };
        default:
          return prev;
      }
    });
  };

  const switchPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'player1' ? 'player2' : 'player1',
      currentPhase: 'recording',
      recordedAudio: null,
      currentAudioUrl: null,
      canRerecord: true,
      originalSong: '',
      currentGuess: '',
      currentReversedUrl: null,
      timeLeft: recordingTimer
    }));
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
    reverseAudio,
    submitGuess,
    nextPhase,
    switchPlayer,
    mediaRecorderRef,
    audioRef
  };
};
