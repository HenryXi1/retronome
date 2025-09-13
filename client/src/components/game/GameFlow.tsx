import React, { useState } from 'react';
import { useGameLogic } from './shared/useGameLogic';
import PageLayout from '../shared/PageLayout';
import RecordingPhase from './phases/RecordingPhase';
import ListeningPhase from './phases/ListeningPhase';
import ReversingPhase from './phases/ReversingPhase';
import GuessingPhase from './phases/GuessingPhase';
import ResultsPhase from './phases/ResultsPhase';

const GameFlow: React.FC = () => {
  const {
    gameState,
    updateGameState,
    startRecording,
    stopRecording,
    playAudio,
    reverseAudio,
    submitGuess,
    nextPhase,
    switchPlayer
  } = useGameLogic();

  const maxTime = parseInt(localStorage.getItem('recordingTimer') || '30');

  const [isReversing, setIsReversing] = useState(false);

  const handleConfirmRecording = () => {
    nextPhase();
  };

  const handleRerecord = () => {
    updateGameState({
      recordedAudio: null,
      currentAudioUrl: null,
      canRerecord: false
    });
  };

  const handleStartReversing = async () => {
    if (gameState.recordedAudio) {
      setIsReversing(true);
      await reverseAudio(gameState.recordedAudio);
      setIsReversing(false);
      nextPhase();
    }
  };

  const handleSubmitGuess = () => {
    submitGuess();
  };

  const handleNextRound = () => {
    switchPlayer();
  };

  const renderCurrentPhase = () => {
    switch (gameState.currentPhase) {
      case 'recording':
        return (
          <RecordingPhase
            currentPlayer={gameState.currentPlayer}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            timeLeft={gameState.timeLeft}
            maxTime={maxTime}
            isRecording={gameState.isRecording}
            recordedAudio={gameState.recordedAudio}
            canRerecord={gameState.canRerecord}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onConfirmRecording={handleConfirmRecording}
            onRerecord={handleRerecord}
          />
        );

      case 'listening':
        return (
          <ListeningPhase
            currentPlayer={gameState.currentPlayer}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            currentAudioUrl={gameState.currentAudioUrl}
            onPlayAudio={playAudio}
            onNextPhase={nextPhase}
          />
        );

      case 'reversing':
        return (
          <ReversingPhase
            isReversing={isReversing}
            onStartReversing={handleStartReversing}
            onNextPhase={nextPhase}
          />
        );

      case 'guessing':
        return (
          <GuessingPhase
            currentPlayer={gameState.currentPlayer}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            currentReversedUrl={gameState.currentReversedUrl}
            currentGuess={gameState.currentGuess}
            onPlayReversedAudio={playAudio}
            onGuessChange={(guess) => updateGameState({ currentGuess: guess })}
            onSubmitGuess={handleSubmitGuess}
          />
        );

      case 'results':
        return (
          <ResultsPhase
            audioClips={gameState.audioClips}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            onPlayAudio={playAudio}
            onNextRound={handleNextRound}
            onBackToHome={() => window.location.href = '/'}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout 
      title="🎵 Reverse Audio Game" 
      subtitle={`${gameState.player1Name} vs ${gameState.player2Name}`}
      backPath="/"
    >
      {renderCurrentPhase()}
    </PageLayout>
  );
};

export default GameFlow;