import React from 'react';
import { useGameLogic } from './shared/useGameLogic';
import PageLayout from '../shared/PageLayout';
import RecordingPhase from './phases/RecordingPhase';
import ReversingPhase from './phases/ReversingPhase';
import ResultsPhase from './phases/ResultsPhase';

const GameFlow: React.FC = () => {
  const {
    gameState,
    updateGameState,
    startRecording,
    stopRecording,
    playAudio,
    nextPhase,
    switchPlayer
  } = useGameLogic();

  const maxTime = parseInt(localStorage.getItem('recordingTimer') || '30');

  const handleConfirmRecording = () => {
    nextPhase();
  };

  const handleRerecord = () => {
    updateGameState({
      recordedAudio: null,
      currentAudioUrl: null,
      timeLeft: maxTime,
      isRecording: false
    });
  };


  const handleNextRound = () => {
    switchPlayer();
  };

  const renderCurrentPhase = () => {
    switch (gameState.currentPhase) {
      case 'recording':
      case 'recording-reversed':
        return (
          <RecordingPhase
            currentPlayer={gameState.currentPlayer}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            timeLeft={gameState.timeLeft}
            maxTime={maxTime}
            isRecording={gameState.isRecording}
            recordedAudio={gameState.recordedAudio}
            currentAudioUrl={gameState.currentAudioUrl}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onConfirmRecording={handleConfirmRecording}
            onRerecord={handleRerecord}
            onPlayAudio={playAudio}
          />
        );

      case 'listening':
        return (
          <ReversingPhase
            currentPlayer={gameState.currentPlayer}
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            currentAudioUrl={gameState.currentAudioUrl}
            currentReversedUrl={gameState.currentReversedUrl}
            onPlayAudio={playAudio}
            onNextPhase={nextPhase}
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {renderCurrentPhase()}
      </div>
    </PageLayout>
  );
};

export default GameFlow;