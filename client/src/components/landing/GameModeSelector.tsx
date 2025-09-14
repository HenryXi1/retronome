import React from 'react';
import { Space, Typography } from 'antd';
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';
import GameModeCard from './GameModeCard';

const { Title } = Typography;

const GameModeSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode: 'local' | 'online-multiplayer') => {
    navigate(`/${mode}/start`);
  };

  return (
    <PageLayout
      title=""
      subtitle=""
      showBackButton={false}
      backgroundClass="landing-background"
    >
      <div className="glass-card max-w-3xl w-full" style={{ padding: '48px' }}>
        {/* Logo and subtitle inside the card */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div>
            <img 
              src="/retronome-logo.png" 
              alt="RETRONOME Logo" 
              style={{
                maxWidth: '200px',
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}
            />
          </div>
          <Typography.Text style={{
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}>
            Choose your game mode and start the musical chaos!
          </Typography.Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <GameModeCard
            title="Local Play"
            description="Play with a friend on the same device. Perfect for couch co-op!"
            icon={<HomeOutlined style={{ fontSize: '2rem', color: 'white' }} />}
            onClick={() => handleModeSelect('local')}
            color="#3b82f6"
            hoverColor="#1d4ed8"
          />

          <GameModeCard
            title="Online Multiplayer"
            description="Up to 8 players! Watch the audio get more chaotic with each round."
            icon={<TeamOutlined style={{ fontSize: '2rem', color: 'white' }} />}
            onClick={() => handleModeSelect('online-multiplayer')}
            color="#6366f1"
            hoverColor="#4338ca"
          />
        </Space>
      </div>
    </PageLayout>
  );
};

export default GameModeSelector;
