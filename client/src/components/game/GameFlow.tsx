import React from 'react';
import { useGameLogic } from './shared/useGameLogic';
import PageLayout from '../shared/PageLayout';
import RecordingPhase from './phases/RecordingPhase';
import ReversingPhase from './phases/ReversingPhase';
import ResultsPhase from './phases/ResultsPhase';

const GameFlow: React.FC = () => {
  const {
    gameState,
    startRecording,
    stopRecording,
    playAudio,
    nextPhase,
    switchPlayer,
    confirmRecording,
    rerecord
  } = useGameLogic();

  const maxTime = parseInt(localStorage.getItem('recordingTimer') || '30');

  const handleConfirmRecording = () => {
    confirmRecording();
  };

  const handleRerecord = () => {
    rerecord();
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
            currentPhase={gameState.currentPhase}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onConfirmRecording={handleConfirmRecording}
            onRerecord={handleRerecord}
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

  const getBackgroundClass = () => {
    if (gameState.currentPhase === 'results') {
      return 'results-background';
    }
    return 'game-background';
  };

  return (
    <PageLayout
      title="Reverse Audio Game"
      subtitle={`${gameState.player1Name} vs ${gameState.player2Name}`}
      backPath="/"
      backgroundClass={getBackgroundClass()}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {renderCurrentPhase()}
      </div>
    </PageLayout>
  );
};

export default GameFlow;