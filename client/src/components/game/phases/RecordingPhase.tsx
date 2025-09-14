import React, { useState, useEffect } from 'react';
import { Typography, Button, Space } from 'antd';
import { AudioOutlined, StopOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface RecordingPhaseProps {
  currentPlayer: 'player1' | 'player2';
  player1Name: string;
  player2Name: string;
  timeLeft: number;
  maxTime: number;
  isRecording: boolean;
  recordedAudio: Blob | null;
  currentPhase: 'recording' | 'recording-reversed';
  isMultiplayer?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onConfirmRecording: () => void;
  onRerecord: () => void;
}

const RecordingPhase: React.FC<RecordingPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  isRecording,
  recordedAudio,
  currentPhase,
  isMultiplayer = false,
  onStartRecording,
  onStopRecording,
  onConfirmRecording,
  onRerecord
}) => {
  const currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleConfirmRecording = () => {
    onConfirmRecording();
    if (isMultiplayer) {
      setHasSubmitted(true);
    }
  };

  // Reset submission state when we get new audio or enter a new phase
  useEffect(() => {
    if (recordedAudio) {
      setHasSubmitted(false);
    }
  }, [recordedAudio, currentPhase]);

  // Determine what UI state to show
  const showSubmittedState = isMultiplayer && hasSubmitted && !recordedAudio;

  return (
    <>
      {/* Add CSS animation for loading dots */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        border: '3px solid rgba(139, 92, 246, 0.3)',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        height: '450px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Timer in top right corner */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          transform: 'scale(0.7)'
        }}>
          {/* <CircularTimer timeLeft={timeLeft} maxTime={maxTime} /> */}
        </div>

        {/* Main content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          {showSubmittedState ? (
            <>
              {/* Checkmark icon for submitted state */}
              <div style={{ fontSize: '50px', marginBottom: '8px' }}>
                ✅
              </div>

              {/* Main title */}
              <Title level={1} style={{
                color: '#2d3748',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                RECORDING SUBMITTED!
              </Title>

              {/* Subtitle */}
              <Paragraph style={{
                color: '#718096',
                fontSize: '1rem',
                marginBottom: '8px'
              }}>
                Waiting for the next round...
              </Paragraph>

              {/* Loading animation */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#48bb78',
                      animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Instruction pill */}
              <div style={{
                background: 'rgba(72, 187, 120, 0.1)',
                color: '#38a169',
                padding: '10px 20px',
                borderRadius: '50px',
                border: '2px solid rgba(72, 187, 120, 0.2)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                🎵 Hang on tight...
              </div>
            </>
          ) : (
            <>
              {/* Phone icon like Gartic Phone */}
              <div style={{ fontSize: '50px', marginBottom: '8px' }}>
                📞
              </div>

              {/* Main title */}
              <Title level={1} style={{
                color: '#2d3748',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {recordedAudio ? 'RECORDING COMPLETE!' : (isRecording ? 'RECORDING...' : 'RECORD A SNIPPET')}
              </Title>

              {/* Subtitle */}
              <Paragraph style={{
                color: '#718096',
                fontSize: '1rem',
                marginBottom: '8px'
              }}>
                {currentPlayerName}'s turn to sing!
              </Paragraph>

              {/* Button(s) */}
              {!recordedAudio ? (
                <Button
                  type="primary"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  size="large"
                  icon={isRecording ? <StopOutlined /> : <AudioOutlined />}
                  style={{
                    background: isRecording
                      ? 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
                      : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                    border: 'none',
                    height: '80px',
                    width: '80px',
                    borderRadius: '50%',
                    fontSize: '24px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                    marginBottom: '8px'
                  }}
                />
              ) : (
                <Space size="middle" style={{ marginBottom: '8px' }}>
                  <Button
                    type="primary"
                    onClick={handleConfirmRecording}
                    icon={<CheckOutlined />}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      border: 'none',
                      height: '55px',
                      padding: '0 35px',
                      borderRadius: '30px',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}
                  >
                    DONE!
                  </Button>

                  <Button
                    onClick={onRerecord}
                    icon={<ReloadOutlined />}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                      border: 'none',
                      color: 'white',
                      height: '55px',
                      padding: '0 30px',
                      borderRadius: '30px',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}
                  >
                    RETRY
                  </Button>
                </Space>
              )}

              {/* Instruction pill */}
              <div style={{
                background: 'rgba(66, 153, 225, 0.1)',
                color: '#2b6cb0',
                padding: '10px 20px',
                borderRadius: '50px',
                border: '2px solid rgba(66, 153, 225, 0.2)',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {currentPhase === 'recording'
                  ? '💡 Sing a part of a song or choose a phrase!'
                  : '🔄 Try your best to sing the reversed audio!'
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RecordingPhase;
