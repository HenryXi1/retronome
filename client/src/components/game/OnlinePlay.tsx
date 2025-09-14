import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GenericGameFlow from './GenericGameFlow';
import { useMultiplayerGameController } from './controllers/MultiplayerGameController';

interface GameState {
  gameStarted: boolean;
  room: any;
  players: Record<string, string>;
}

const OnlinePlay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from navigation state (passed from MultiplayerLobby)
  const gameState = location.state as GameState | null;
  
  // Read data from localStorage to get player info
  const [roomCode] = useState(localStorage.getItem('roomCode') || '');
  const [playerName] = useState(localStorage.getItem('playerName') || '');
  const [playerId] = useState(localStorage.getItem('playerId') || '');
  const [gameReady, setGameReady] = useState(false);

  // Check for required data and redirect if missing
  const hasRequiredData = roomCode && playerName && playerId;

  // Initialize game from navigation state
  useEffect(() => {
    // Redirect if missing required data
    if (!hasRequiredData) {
      navigate('/online-multiplayer/start');
      return;
    }

    // Game data should always be passed via navigation state from MultiplayerLobby
    if (gameState?.gameStarted) {
      console.log('game started');
      setGameReady(true);
    } else {
      // TESTING BYPASS: Allow direct access for testing
      console.warn('OnlinePlay: No game state found, allowing for testing');
      setGameReady(true);
      
      // Uncomment to redirect back to lobby in production:
      // navigate('/online-multiplayer/room');
    }
  }, [gameState, navigate, hasRequiredData]);

  // Initialize the multiplayer game controller
  const controller = useMultiplayerGameController();

  // Show loading state until game is ready or if missing data
  if (!hasRequiredData || !gameReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '24px' }}>🎮</div>
        <div>Initializing game...</div>
      </div>
    );
  }

  return (
    <GenericGameFlow 
      controller={controller} 
      isMultiplayer={true}
    />
  );
};

export default OnlinePlay;
