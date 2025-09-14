import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';

const OnlinePlay: React.FC = () => {
  const navigate = useNavigate();
  
  // Read data from localStorage to get player info
  const [roomCode] = useState(localStorage.getItem('roomCode') || '');
  const [playerName] = useState(localStorage.getItem('playerName') || '');

  // If no data, redirect to setup
  if (!roomCode || !playerName) {
    navigate('/online-multiplayer/start');
    return null;
  }

  const backToLobby = () => {
    navigate('/online-multiplayer/room');
  };

  return (
    <PageLayout
      title="Multiplayer Game"
      subtitle={`Room: ${roomCode} | Player: ${playerName}`}
      backgroundClass="setup-background"
    >
      <div className="glass-card max-w-lg w-full" style={{ padding: '24px', textAlign: 'center' }}>
        <Typography.Title level={4} style={{ color: '#4c1d95' }}>
          🎮 Multiplayer Game
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#1e293b', marginBottom: '24px' }}>
          This is where the actual multiplayer game will be implemented. 
          You can use the same game components as local play but with multiplayer controller.
        </Typography.Paragraph>
        <Button 
          onClick={backToLobby}
          style={{ borderRadius: '12px' }}
        >
          ← Back to Lobby
        </Button>
      </div>
    </PageLayout>
  );
};

export default OnlinePlay;
