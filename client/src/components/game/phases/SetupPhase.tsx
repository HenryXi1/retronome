import React from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { UserOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SetupPhaseProps {
  player1Name: string;
  player2Name: string;
  onPlayer1NameChange: (name: string) => void;
  onPlayer2NameChange: (name: string) => void;
  onStartGame: () => void;
}

const SetupPhase: React.FC<SetupPhaseProps> = ({
  player1Name,
  player2Name,
  onPlayer1NameChange,
  onPlayer2NameChange,
  onStartGame
}) => {
  const canStart = player1Name.trim() && player2Name.trim();

  return (
    <Card className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🎵 Game Setup
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Enter player names to start the musical chaos!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#1e293b',
            fontWeight: '500'
          }}>
            Player 1 Name
          </label>
          <Input
            size="large"
            placeholder="Enter Player 1's name"
            value={player1Name}
            onChange={(e) => onPlayer1NameChange(e.target.value)}
            prefix={<UserOutlined />}
            className="custom-input"
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#1e293b',
            fontWeight: '500'
          }}>
            Player 2 Name
          </label>
          <Input
            size="large"
            placeholder="Enter Player 2's name"
            value={player2Name}
            onChange={(e) => onPlayer2NameChange(e.target.value)}
            prefix={<UserOutlined />}
            className="custom-input"
          />
        </div>

        <div className="text-center" style={{ marginTop: '2rem' }}>
          <Button
            type="primary"
            onClick={onStartGame}
            disabled={!canStart}
            className="large-button"
            size="large"
            icon={<PlayCircleOutlined />}
            style={{
              background: canStart ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#d1d5db',
              border: 'none',
              height: '64px',
              fontSize: '20px',
              padding: '0 32px',
              borderRadius: '20px'
            }}
          >
            Start Game
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default SetupPhase;
