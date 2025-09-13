import React from 'react';
import { Typography, Button, Space } from 'antd';
import { SoundOutlined, AudioOutlined, StopOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ReversingPhaseProps {
  currentPlayer: 'player1' | 'player2';
  player1Name: string;
  player2Name: string;
  currentAudioUrl: string | null;
  currentReversedUrl: string | null;
  timeLeft: number;
  maxTime: number;
  isRecording: boolean;
  recordedAudio: Blob | null;
  recordedReversedUrl: string | null;
  onPlayAudio: (url: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onConfirmRecording: () => void;
  onRerecord: () => void;
  onNextPhase: () => void;
}

const ReversingPhase: React.FC<ReversingPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  currentAudioUrl,
  currentReversedUrl,
  timeLeft,
  maxTime,
  isRecording,
  recordedAudio,
  recordedReversedUrl,
  onPlayAudio,
  onStartRecording,
  onStopRecording,
  onConfirmRecording,
  onRerecord,
  onNextPhase
}) => {
  const currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const otherPlayerName = currentPlayer === 'player1' ? player2Name : player1Name;
  const progressPercent = (timeLeft / maxTime) * 100;

  // Circular timer component
  const CircularTimer = () => {
    const radius = 60;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            stroke="rgba(59, 130, 246, 0.2)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={timeLeft <= 10 ? '#ef4444' : '#3b82f6'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: timeLeft <= 10 ? '#ef4444' : '#1e293b'
        }}>
          {timeLeft}s
        </div>
      </div>
    );
  };

  return (
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
        {/* Timer in top right corner - only show when recording */}
        {isRecording && (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            transform: 'scale(0.7)'
          }}>
            <CircularTimer />
          </div>
        )}

        {/* Main content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          {!recordedAudio ? (
            <>
              {/* Reverse icon */}
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>
                🔄
              </div>

              {/* Main title */}
              <Title level={1} style={{
                color: '#2d3748',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {isRecording ? 'RECORDING...' : 'REVERSE THE AUDIO'}
              </Title>

              {/* Subtitle */}
              <Paragraph style={{
                color: '#718096',
                fontSize: '1rem',
                marginBottom: '20px'
              }}>
                {currentPlayerName}, listen to the reversed audio and try to sing it back!
              </Paragraph>

              {/* Play reversed audio button */}
              <Button
                type="primary"
                onClick={() => currentReversedUrl && onPlayAudio(currentReversedUrl)}
                icon={<SoundOutlined />}
                size="large"
                disabled={!currentReversedUrl}
                style={{
                  background: currentReversedUrl
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                    : '#d1d5db',
                  border: 'none',
                  height: '60px',
                  padding: '0 30px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}
              >
                🎵 PLAY REVERSED AUDIO
              </Button>

              {/* Record button */}
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
                  marginBottom: '20px'
                }}
              >
                {isRecording ? 'STOP' : 'RECORD'}
              </Button>

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
                💡 Try to sing exactly what you hear in the reversed audio!
              </div>
            </>
          ) : (
            <>
              {/* Completion emoji */}
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>
                🎉
              </div>

              {/* Main title */}
              <Title level={1} style={{
                color: '#2d3748',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                RECORDING COMPLETE!
              </Title>

              {/* Play button */}
              <Button
                type="primary"
                onClick={() => recordedReversedUrl && onPlayAudio(recordedReversedUrl)}
                icon={<SoundOutlined />}
                size="large"
                disabled={!recordedReversedUrl}
                style={{
                  background: recordedReversedUrl
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                    : '#d1d5db',
                  border: 'none',
                  height: '60px',
                  padding: '0 30px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '25px'
                }}
              >
                🎵 PLAY RECORDING
              </Button>

              {/* Action buttons */}
              <Space size="large">
                <Button
                  type="primary"
                  onClick={onConfirmRecording}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReversingPhase;
