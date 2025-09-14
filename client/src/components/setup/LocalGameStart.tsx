import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from './GameSetupLayout';
import FormField from './shared/FormField';

const LocalGameStart: React.FC = () => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStartGame = () => {
    // TODO: store this in the backend
    // Store player names and timer in localStorage to pass to game
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    navigate('/local');
  };

  const setupContent = (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <FormField
          label="Player 1 Name"
          placeholder="Enter Player 1's name"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />

        <FormField
          label="Player 2 Name"
          placeholder="Enter Player 2's name"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
        />
      </Space>

      <div className="text-center" style={{ marginTop: '2rem' }}>
        <Button
          type="primary"
          onClick={handleStartGame}
          disabled={!player1Name.trim() || !player2Name.trim()}
          className="large-button"
          size="large"
          icon={<PlayCircleOutlined />}
          style={{
            background: (player1Name.trim() && player2Name.trim())
              ? '#10b981'
              : '#d1d5db',
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
    </>
  );

  return (
    <GameSetupLayout
      gameMode="local"
      setupTitle="Player Setup"
      setupContent={setupContent}
    />
  );
};

export default LocalGameStart;
