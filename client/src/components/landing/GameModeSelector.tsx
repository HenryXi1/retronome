import React from 'react';
import { Space } from 'antd';
import { HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';
import GameModeCard from './GameModeCard';

const GameModeSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode: 'local' | 'online-1v1' | 'online-multiplayer') => {
    navigate(`/${mode}/start`);
  };

  return (
    <PageLayout
      title="🎵 REVERSE AUDIO 🎵"
      subtitle="Choose your game mode and start the musical chaos!"
      showBackButton={false}
    >
      <div className="glass-card p-8 max-w-2xl w-full">

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <GameModeCard
            title="Local Play"
            description="Play with a friend on the same device. Perfect for couch co-op!"
            icon={<HomeOutlined style={{ fontSize: '2rem', color: 'white' }} />}
            onClick={() => handleModeSelect('local')}
            color="#10b981"
            hoverColor="#059669"
          />

          <GameModeCard
            title="Online 1v1"
            description="Challenge a friend online. Share a room code to play together!"
            icon={<UserOutlined style={{ fontSize: '2rem', color: 'white' }} />}
            onClick={() => handleModeSelect('online-1v1')}
            color="#3b82f6"
            hoverColor="#2563eb"
          />

          <GameModeCard
            title="Online Multiplayer"
            description="Up to 8 players! Watch the audio get more chaotic with each round."
            icon={<TeamOutlined style={{ fontSize: '2rem', color: 'white' }} />}
            onClick={() => handleModeSelect('online-multiplayer')}
            color="#8b5cf6"
            hoverColor="#7c3aed"
          />
        </Space>
      </div>
    </PageLayout>
  );
};

export default GameModeSelector;
