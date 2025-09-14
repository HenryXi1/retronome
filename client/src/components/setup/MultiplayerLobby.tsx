import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Space, Avatar, message, Select } from 'antd';
import { UserOutlined, CrownOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface LobbyState {
  roomCode: string;
  playerName: string;
  isHost: boolean;
  playerId: string;
  roomData?: any; // Optional initial room data
}

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isEmpty: boolean;
}

const MultiplayerLobby: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMessage, addMessageHandler, isConnected } = useWebSocket();
  
  // Get initial data from navigation state
  const lobbyState = location.state as LobbyState | null;
  
  // Room state - initialize with data from navigation if available
  const [roomData, setRoomData] = useState<any>(lobbyState?.roomData || null);
  const [currentPlayerName] = useState(lobbyState?.playerName || '');
  const [currentPlayerId] = useState(lobbyState?.playerId || '');
  const [maxPlayers, setMaxPlayers] = useState(5);

  // If no initial data, redirect to setup
  if (!lobbyState?.roomCode || !lobbyState?.playerName) {
    navigate('/online-multiplayer/start');
    return null;
  }

  const roomCode = roomData?.code || lobbyState.roomCode;
  const isHost = roomData ? currentPlayerId === roomData.host_id : lobbyState.isHost;

  // Handle WebSocket messages
  useEffect(() => {
    const handleMessage = (response: any) => {
      console.log('🎮 MultiplayerLobby received message:', response);
      if (response.type === 'room_created' || response.type === 'room_joined' || response.type === 'room_updated') {
        setRoomData(response.room);
      } else if (response.type === 'game_round') {
        message.success('Game starting!');
        // Store player info in localStorage for the game
        localStorage.setItem('playerId', currentPlayerId);
        localStorage.setItem('playerName', currentPlayerName);
        localStorage.setItem('roomCode', roomCode);
        
        console.log('roomData', roomData);
        // Pass game data via navigation state to avoid race condition
        navigate('/online-multiplayer', {
          state: {
            gameStarted: true,
            room: response.room,
            player_names: roomData.player_names || {},
          }
        });
      } else if (response.type === 'error') {
        message.error(`Room error: ${response.error}`);
        // If room doesn't exist, go back to setup
        navigate('/online-multiplayer/start');
      }
    };

    const cleanup = addMessageHandler(handleMessage);
    return cleanup;
  }, [addMessageHandler, currentPlayerName, navigate, roomData]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      message.success('Room code copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('Room code copied to clipboard!');
    }
  };

  const startGame = () => {
    if (isHost && isConnected) {
      const startMessage = {
        type: 'start_game'
      };
      sendMessage(startMessage);
    }
  };

  const leaveRoom = () => {
    navigate('/online-multiplayer/start');
  };

  const handleMaxPlayersChange = (value: number) => {
    setMaxPlayers(value);
  };

  // Generate options for max players dropdown
  const maxPlayerOptions = Array.from({ length: 9 }, (_, i) => i + 2).map(num => ({
    value: num,
    label: `${num} players`
  }));

  // Generate players list from room data
  const players: Player[] = roomData && roomData.player_ids && roomData.player_names ? 
    roomData.player_ids.map((id: string) => ({
      id,
      name: roomData.player_names[id] || 'Unknown',
      isHost: id === roomData.host_id,
      isEmpty: false
    })) : 
    [{ id: currentPlayerId, name: currentPlayerName, isHost: lobbyState.isHost, isEmpty: false }];

  // Fill empty slots up to maxPlayers
  while (players.length < maxPlayers) {
    players.push({
      id: `empty-${players.length}`,
      name: 'EMPTY',
      isHost: false,
      isEmpty: true
    });
  }

  return (
    <PageLayout
      title="Waiting Room"
      backgroundClass="setup-background"
    >
      <div className="glass-card max-w-lg w-full" style={{ padding: '48px' }}>
        {/* Room Code Display */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ color: 'white' }}>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              Room Code
            </Typography.Text>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: '4px',
              margin: '8px 0',
              color: 'white'
            }}>
              {roomCode}
            </div>
            <Button
              icon={<CopyOutlined />}
              onClick={copyRoomCode}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '8px'
              }}
              size="small"
            >
              Copy Code
            </Button>
            {!isConnected && (
              <div style={{
                marginTop: '8px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px'
              }}>
                🔄 Reconnecting...
              </div>
            )}
          </div>
        </Card>

        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography.Title level={3} style={{ color: '#4c1d95', margin: 0 }}>
                Players in Room ({players.filter((p: Player) => !p.isEmpty).length}/{maxPlayers})
              </Typography.Title>
              {isHost && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography.Text style={{ color: '#4c1d95', fontSize: '14px', fontWeight: '500' }}>
                    Max:
                  </Typography.Text>
                  <Select
                    value={maxPlayers}
                    onChange={handleMaxPlayersChange}
                    options={maxPlayerOptions}
                    style={{ width: '100px' }}
                    size="small"
                  />
                </div>
              )}
            </div>
          }
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            minHeight: '350px'
          }}
          bodyStyle={{ height: '300px', padding: 0 }}
        >
          <div style={{ height: '300px', overflowY: 'auto', paddingRight: '8px', padding: '16px' }}>
            <List
              dataSource={players}
              renderItem={(player: Player) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ 
                          backgroundColor: player.isEmpty ? '#d1d5db' : '#6366f1',
                          opacity: player.isEmpty ? 0.5 : 1
                        }} 
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          color: player.isEmpty ? '#9ca3af' : '#1e293b',
                          fontWeight: player.isEmpty ? 'normal' : 'bold'
                        }}>
                          {player.name}
                        </span>
                        {player.isHost && (
                          <CrownOutlined style={{ color: '#f59e0b' }} />
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>

        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '32px' }}>
          {isHost ? (
            <Button
              type="primary"
              onClick={startGame}
              size="large"
              style={{
                background: '#10b981',
                border: 'none',
                height: '56px',
                fontSize: '18px',
                borderRadius: '16px',
                width: '100%'
              }}
            >
              🎮 Start Game
            </Button>
          ) : (
            <Card style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)' }}>
              <Typography.Text style={{ color: '#4c1d95' }}>
                ⏳ Waiting for host to start the game...
              </Typography.Text>
            </Card>
          )}

          <Button
            onClick={leaveRoom}
            size="large"
            style={{
              height: '48px',
              borderRadius: '16px',
              width: '100%'
            }}
          >
            ← Leave Room
          </Button>
        </Space>
      </div>
    </PageLayout>
  );
};

export default MultiplayerLobby;
