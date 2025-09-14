import React, { useState, useEffect } from 'react';
import { Button, Space, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from './GameSetupLayout';
import FormField from './shared/FormField';
import { useWebSocket } from '../../contexts/WebSocketContext';

const MultiplayerGameStart: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage, addMessageHandler, isConnected } = useWebSocket();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  // Handle WebSocket messages
  useEffect(() => {
    const handleMessage = (response: any) => {
      
      if (response.type === 'room_created') {
        // Success! Room was created
        const roomCode = response.room.code;
        const hostId = response.room.host_id;
        
        message.success(`Room created successfully! Code: ${roomCode}`);
        setIsCreatingRoom(false);
        
        // Navigate with state including full room data
        navigate('/online-multiplayer/room', {
          state: {
            roomCode,
            playerName: playerName.trim(),
            isHost: true,
            playerId: hostId,
            roomData: response.room // Pass the full room data (TODO: define type)
          }
        });
      } else if (response.type === 'room_joined') {
        // Success! Joined the room
        const joinedRoomCode = response.room.code;
        const playerId = Object.keys(response.room.players).find(
          id => response.room.players[id] === playerName.trim()
        );
        
        message.success(`Successfully joined room ${joinedRoomCode}!`);
        setIsJoiningRoom(false);
        
        // Navigate with state including full room data
        navigate('/online-multiplayer/room', {
          state: {
            roomCode: joinedRoomCode,
            playerName: playerName.trim(),
            isHost: false,
            playerId: playerId || '',
            roomData: response.room // Pass the full room data
          }
        });
      } else if (response.type === 'error') {
        message.error(`Error: ${response.error}`);
        setIsCreatingRoom(false);
        setIsJoiningRoom(false);
      }
    };

    const cleanup = addMessageHandler(handleMessage);
    return cleanup;
  }, [navigate, playerName, roomCode, addMessageHandler]);

  const handleCreateRoom = () => {
    if (!playerName.trim() || !isConnected) return;
    
    setIsCreatingRoom(true);
    
    const createRoomMessage = {
      type: 'create_room',
      player_name: playerName.trim()
    };
    
    sendMessage(createRoomMessage);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim() || !isConnected) return;
    
    setIsJoiningRoom(true);
    
    const joinRoomMessage = {
      type: 'join_room',
      room_id: roomCode.trim(),
      player_name: playerName.trim()
    };
    
    sendMessage(joinRoomMessage);
  };

  const setupContent = (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <FormField
        label="Your Name"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <div style={{
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#ffffff',
          fontWeight: '600'
        }}>
          Join Room
        </label>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="custom-input"
          />
          <Button
            type="primary"
            onClick={handleJoinRoom}
            disabled={!playerName.trim() || !roomCode.trim() || isJoiningRoom || isCreatingRoom || !isConnected}
            loading={isJoiningRoom}
            size="large"
            style={{
              background: (playerName.trim() && roomCode.trim() && !isJoiningRoom && !isCreatingRoom)
                ? '#3b82f6'
                : '#d1d5db',
              border: 'none',
              width: '100%',
              height: '48px',
              fontSize: '16px',
              borderRadius: '12px'
            }}
          >
            {isJoiningRoom ? 'Joining...' : 'Join Room'}
          </Button>
        </Space>
      </div>

      <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '14px' }}>
        OR
      </div>

      <Button
        type="primary"
        onClick={handleCreateRoom}
        disabled={!playerName.trim() || isCreatingRoom || isJoiningRoom || !isConnected}
        loading={isCreatingRoom}
        size="large"
        style={{
          background: (playerName.trim() && !isCreatingRoom && !isJoiningRoom)
            ? '#10b981'
            : '#d1d5db',
          border: 'none',
          width: '100%',
          height: '48px',
          fontSize: '16px',
          borderRadius: '12px'
        }}
      >
        {isCreatingRoom ? 'Creating Room...' : 'Create Room'}
      </Button>
    </Space>
  );

  return (
    <GameSetupLayout
      gameMode="online-multiplayer"
      setupTitle="Game Setup"
      setupContent={setupContent}
    />
  );
};

export default MultiplayerGameStart;
