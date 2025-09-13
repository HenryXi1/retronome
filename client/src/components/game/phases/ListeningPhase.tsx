import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { SoundOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ListeningPhaseProps {
  currentPlayer: 'player1' | 'player2';
  player1Name: string;
  player2Name: string;
  currentAudioUrl: string | null;
  onPlayAudio: (url: string) => void;
  onNextPhase: () => void;
}

const ListeningPhase: React.FC<ListeningPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  currentAudioUrl,
  onPlayAudio,
  onNextPhase
}) => {
  const currentPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const otherPlayerName = currentPlayer === 'player1' ? player2Name : player1Name;

  return (
    <Card className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🎧 Listening Phase
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          {currentPlayerName}, listen to {otherPlayerName}'s recording!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Audio Player */}
        <div className="text-center">
          <Button
            type="primary"
            onClick={() => currentAudioUrl && onPlayAudio(currentAudioUrl)}
            className="large-button"
            size="large"
            icon={<SoundOutlined />}
            disabled={!currentAudioUrl}
            style={{
              background: currentAudioUrl 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
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
          
          {currentAudioUrl && (
            <div style={{ marginTop: '1rem' }}>
              <Paragraph style={{ color: '#64748b', margin: 0 }}>
                Click the button above to listen to the recording
              </Paragraph>
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card style={{ 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px'
        }}>
          <Paragraph style={{ 
            color: '#7c3aed', 
            margin: 0, 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            🎵 <strong>Listen carefully!</strong> You'll need to recreate this in the next phase.
          </Paragraph>
        </Card>

        {/* Next Button */}
        <div className="text-center">
          <Button
            type="primary"
            onClick={onNextPhase}
            className="large-button"
            size="large"
            icon={<ArrowRightOutlined />}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              height: '56px',
              fontSize: '18px',
              padding: '0 32px',
              borderRadius: '16px'
            }}
          >
            Ready to Record My Version
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default ListeningPhase;
