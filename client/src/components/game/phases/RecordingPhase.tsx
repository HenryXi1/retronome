import React from 'react';
import { Card, Typography, Button, Space, Progress, Row, Col } from 'antd';
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
  canRerecord: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onConfirmRecording: () => void;
  onRerecord: () => void;
}

const RecordingPhase: React.FC<RecordingPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  timeLeft,
  maxTime,
  isRecording,
  recordedAudio,
  canRerecord,
  onStartRecording,
  onStopRecording,
  onConfirmRecording,
  onRerecord
}) => {
  const currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const progressPercent = (timeLeft / maxTime) * 100;

  return (
    <Card className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🎤 Recording Phase
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          {currentPlayerName}'s turn to record a song snippet!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Timer */}
        <div className="text-center">
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: timeLeft <= 10 ? '#ef4444' : '#1e293b',
            marginBottom: '1rem'
          }}>
            {timeLeft}s
          </div>
          <Progress 
            percent={progressPercent} 
            strokeColor={timeLeft <= 10 ? '#ef4444' : '#10b981'}
            showInfo={false}
            style={{ maxWidth: '300px', margin: '0 auto' }}
          />
        </div>

        {/* Recording Controls */}
        <div className="text-center">
          {!recordedAudio ? (
            <Button
              type="primary"
              onClick={isRecording ? onStopRecording : onStartRecording}
              className="large-button"
              size="large"
              icon={isRecording ? <StopOutlined /> : <AudioOutlined />}
              style={{
                background: isRecording 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                height: '80px',
                width: '80px',
                borderRadius: '50%',
                fontSize: '24px'
              }}
            >
              {isRecording ? 'Stop' : 'Record'}
            </Button>
          ) : (
            <Space direction="vertical" size="middle">
              <div>
                <Title level={4} style={{ color: '#1e293b', marginBottom: '1rem' }}>
                  Recording Complete! 🎉
                </Title>
                <Paragraph style={{ color: '#64748b' }}>
                  Listen to your recording and decide if you want to keep it or re-record.
                </Paragraph>
              </div>
              
              <Space size="middle">
                <Button
                  type="primary"
                  onClick={onConfirmRecording}
                  icon={<CheckOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    height: '48px',
                    padding: '0 24px',
                    borderRadius: '12px'
                  }}
                >
                  Keep Recording
                </Button>
                
                {canRerecord && (
                  <Button
                    onClick={onRerecord}
                    icon={<ReloadOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      color: 'white',
                      height: '48px',
                      padding: '0 24px',
                      borderRadius: '12px'
                    }}
                  >
                    Re-record
                  </Button>
                )}
              </Space>
            </Space>
          )}
        </div>

        {/* Instructions */}
        <Card style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px'
        }}>
          <Paragraph style={{ 
            color: '#1e40af', 
            margin: 0, 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            💡 <strong>Tip:</strong> Sing a recognizable part of a song - chorus, verse, or hook!
          </Paragraph>
        </Card>
      </Space>
    </Card>
  );
};

export default RecordingPhase;
