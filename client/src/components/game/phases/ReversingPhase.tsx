import React from 'react';
import { Typography, Button } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ReversingPhaseProps {
  currentPlayer: 'player1' | 'player2';
  player1Name: string;
  player2Name: string;
  currentAudioUrl: string | null;
  currentReversedUrl: string | null;
  onPlayAudio: (url: string) => void;
  onNextPhase: () => void;
}

const ReversingPhase: React.FC<ReversingPhaseProps> = ({
  currentPlayer,
  player1Name,
  player2Name,
  currentAudioUrl,
  currentReversedUrl,
  onPlayAudio,
  onNextPhase
}) => {
  const listeningPlayerName = currentPlayer === 'player1' ? player1Name : player2Name;
  const recordingPlayerName = currentPlayer === 'player1' ? player2Name : player1Name;


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
        {/* Main content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Reverse icon */}
          <div style={{ fontSize: '50px', marginBottom: '8px' }}>
            🔄
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
            LISTEN TO REVERSED AUDIO
          </Title>

          {/* Subtitle */}
          <Paragraph style={{
            color: '#718096',
            fontSize: '1rem',
            marginBottom: '8px'
          }}>
            {listeningPlayerName}, listen carefully to {recordingPlayerName}'s reversed recording!
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
              height: '80px',
              width: '80px',
              borderRadius: '50%',
              fontSize: '24px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
              marginBottom: '8px'
            }}
          />


          {/* Ready to record button */}
          <Button
            type="primary"
            onClick={onNextPhase}
            size="large"
            style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              border: 'none',
              height: '60px',
              padding: '0 40px',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            I'M READY TO RECORD!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReversingPhase;
