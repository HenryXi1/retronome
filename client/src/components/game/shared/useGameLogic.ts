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

  // Audio reversal will be handled automatically in the backend
  // The reversed audio URL will be provided when needed


  const nextPhase = () => {
    setGameState(prev => {
      switch (prev.currentPhase) {
        case 'setup':
          return { ...prev, currentPhase: 'recording' };
        case 'recording':
          // Save the original recording and go to listening phase
          return {
            ...prev,
            currentPhase: 'listening',
            originalRecordingUrl: prev.currentAudioUrl,
            currentReversedUrl: prev.currentAudioUrl, // For now, use same audio (you'll replace with API call)
            recordedAudio: null,
            currentAudioUrl: null,
            timeLeft: recordingTimer
          };
        case 'listening':
          // User clicked "I'm ready to record" - go to recording-reversed phase
          return {
            ...prev,
            currentPhase: 'recording-reversed',
            recordedAudio: null,
            currentAudioUrl: null,
            timeLeft: recordingTimer
          };
        case 'recording-reversed':
          // Save the reversed attempt and go to results
          const newClip: AudioClip = {
            id: Date.now().toString(),
            player: prev.currentPlayer,
            originalUrl: prev.originalRecordingUrl || '',
            reversedUrl: prev.currentAudioUrl || '',
            timestamp: new Date(),
            originalSong: '',
            guess: '',
            isCorrect: false
          };

          return {
            ...prev,
            currentPhase: 'results',
            reversedAttemptUrl: prev.currentAudioUrl,
            audioClips: [...prev.audioClips, newClip]
          };
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
    nextPhase,
    switchPlayer,
    mediaRecorderRef,
    audioRef
  };
};
