import React from 'react';
import { Card, Typography, Button, Space, Input } from 'antd';
import { SoundOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface GuessingPhaseProps {
  currentPlayer: 'player1' | 'player2';
  player1Name: string;
  player2Name: string;
  currentReversedUrl: string | null;
  currentGuess: string;
  onPlayReversedAudio: (url: string) => void;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
}

const GuessingPhase: React.FC<GuessingPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  currentReversedUrl,
  currentGuess,
  onPlayReversedAudio,
  onGuessChange,
  onSubmitGuess
}) => {
  const currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const otherPlayerName = currentPlayer === 'player1' ? player2Name : player1Name;

  return (
    <Card className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🎯 Guessing Phase
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          {currentPlayerName}, listen to the reversed audio and guess what {otherPlayerName} originally sang!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Reversed Audio Player */}
        <div className="text-center">
          <Button
            type="primary"
            onClick={() => currentReversedUrl && onPlayReversedAudio(currentReversedUrl)}
            className="large-button"
            size="large"
            icon={<SoundOutlined />}
            disabled={!currentReversedUrl}
            style={{
              background: currentReversedUrl 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                : '#d1d5db',
              border: 'none',
              height: '80px',
              width: '80px',
              borderRadius: '50%',
              fontSize: '24px'
            }}
          >
            Play
          </Button>
          
          {currentReversedUrl && (
            <div style={{ marginTop: '1rem' }}>
              <Paragraph style={{ color: '#64748b', margin: 0 }}>
                🎵➡️🎶 Listen to the reversed audio above
              </Paragraph>
            </div>
          )}
        </div>

        {/* Guess Input */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#1e293b',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            What song do you think this is?
          </label>
          <Input
            size="large"
            placeholder="Enter your guess..."
            value={currentGuess}
            onChange={(e) => onGuessChange(e.target.value)}
            className="custom-input"
            style={{ textAlign: 'center' }}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="primary"
            onClick={onSubmitGuess}
            disabled={!currentGuess.trim()}
            className="large-button"
            size="large"
            icon={<CheckOutlined />}
            style={{
              background: currentGuess.trim() 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : '#d1d5db',
              border: 'none',
              height: '56px',
              fontSize: '18px',
              padding: '0 32px',
              borderRadius: '16px'
            }}
          >
            Submit Guess
          </Button>
        </div>

        {/* Instructions */}
        <Card style={{ 
          background: 'rgba(245, 158, 11, 0.1)', 
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px'
        }}>
          <Paragraph style={{ 
            color: '#d97706', 
            margin: 0, 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            🧠 <strong>Think hard!</strong> Listen to the reversed audio and try to figure out what the original song was!
          </Paragraph>
        </Card>
      </Space>
    </Card>
  );
};

export default GuessingPhase;
