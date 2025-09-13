import React from 'react';
import PageLayout from '../shared/PageLayout';
import RecordingPhase from './phases/RecordingPhase';
import ReversingPhase from './phases/ReversingPhase';
import ResultsPhase from './phases/ResultsPhase';
import { GameController } from './interfaces';

interface GenericGameFlowProps {
    controller: GameController;
}

const GenericGameFlow: React.FC<GenericGameFlowProps> = ({ controller }) => {
    const renderCurrentPhase = () => {
        switch (controller.currentPhase) {
            case 'recording':
            case 'recording-reversed':
                return (
                    <RecordingPhase
                        currentPlayer={controller.currentPlayer}
                        player1Name={controller.player1Name}
                        player2Name={controller.player2Name}
                        timeLeft={controller.timeLeft}
                        maxTime={controller.maxTime}
                        isRecording={controller.isRecording}
                        recordedAudio={controller.recordedAudio}
                        currentPhase={controller.currentPhase}
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
                        player1Name={controller.player1Name}
                        player2Name={controller.player2Name}
                        currentAudioUrl={controller.currentAudioUrl}
                        currentReversedUrl={controller.currentReversedUrl}
                        onPlayAudio={controller.playAudio}
                        onNextPhase={controller.nextPhase}
                    />
                );

            case 'results':
                return (
                    <ResultsPhase
                        audioClips={controller.audioClips}
                        player1Name={controller.player1Name}
                        player2Name={controller.player2Name}
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
            title="Reverse Audio Game"
            subtitle={`${controller.player1Name} vs ${controller.player2Name}`}
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
