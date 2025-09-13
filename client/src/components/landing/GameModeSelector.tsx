import React from 'react';
import { Card, Typography, Space } from 'antd';
import { HomeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';

const { Title, Paragraph } = Typography;

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

interface GameModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  hoverColor: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  color,
  hoverColor
}) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${hoverColor} 100%)`,
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      bodyStyle={{
        padding: '20px',
      }}
      className="hover:scale-105"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          {icon}
        </div>
        <div>
          <Title level={3} style={{ 
            color: 'white', 
            marginBottom: '8px',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {title}
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.125rem',
            marginBottom: 0,
            fontWeight: '500'
          }}>
            {description}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default GameModeSelector;
