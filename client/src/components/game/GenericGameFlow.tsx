import React from 'react';
import PageLayout from '../shared/PageLayout';
import RecordingPhase from './phases/RecordingPhase';
import ReversingPhase from './phases/ReversingPhase';
import ResultsPhase from './phases/ResultsPhase';
import MultiplayerResultsPhase from './phases/MultiplayerResultsPhase';
import { GameController } from './interfaces';

interface GenericGameFlowProps {
    controller: GameController;
    isMultiplayer?: boolean;
    players?: { id: string, name: string }[];
}

const GenericGameFlow: React.FC<GenericGameFlowProps> = ({ controller, isMultiplayer = false, players = [] }) => {
    const renderCurrentPhase = () => {
        switch (controller.currentPhase) {
            case 'recording':
            case 'recording-reversed':
                return (
                    <RecordingPhase
                        currentPlayer={controller.currentPlayer}
                        player1Name={controller.player1Name || 'Player 1'}
                        player2Name={controller.player2Name || 'Player 2'}
                        timeLeft={controller.timeLeft}
                        maxTime={controller.maxTime}
                        isRecording={controller.isRecording}
                        recordedAudio={controller.recordedAudio}
                        currentPhase={controller.currentPhase}
                        isMultiplayer={isMultiplayer}
                        onStartRecording={controller.startRecording}
                        onStopRecording={controller.stopRecording}
                        onConfirmRecording={controller.confirmRecording}
                        onRerecord={controller.rerecord}
                    />
                );

            case 'listening':
                return (
                    <ReversingPhase
                        currentPlayer={controller.currentPlayer}
                        player1Name={controller.player1Name || 'Player 1'}
                        player2Name={controller.player2Name || 'Player 2'}
                        currentReversedUrl={controller.currentReversedUrl}
                        onPlayAudio={controller.playAudio}
                        onNextPhase={controller.nextPhase}
                    />
                );

            case 'results':
                return isMultiplayer ? (
                    <MultiplayerResultsPhase
                        audioClips={controller.audioClips}
                        players={players}
                        onPlayAudio={controller.playAudio}
                        onBackToHome={controller.backToHome}
                    />
                ) : (
                    <ResultsPhase
                        audioClips={controller.audioClips}
                        player1Name={controller.player1Name || 'Player 1'}
                        player2Name={controller.player2Name || 'Player 2'}
                        onPlayAudio={controller.playAudio}
                        onNextRound={controller.nextRound}
                        onBackToHome={controller.backToHome}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <PageLayout
            title="Retronome"
            subtitle={isMultiplayer ? "Multiplayer Game" : `${controller.player1Name} vs ${controller.player2Name}`}
            backPath="/"
            backgroundClass="game-background"
        >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {renderCurrentPhase()}
            </div>
        </PageLayout>
    );
};

export default GenericGameFlow;
