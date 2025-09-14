import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameModeSelector from './components/landing/GameModeSelector';
import LocalGameStart from './components/setup/LocalGameStart';
import MultiplayerGameStart from './components/setup/MultiplayerGameStart';
import MultiplayerLobby from './components/setup/MultiplayerLobby';
import LocalPlay from './components/game/LocalPlay';
import OnlinePlay from './components/game/OnlinePlay';
import { WebSocketProvider } from './contexts/WebSocketContext';

function App(): React.JSX.Element {
  return (
    <Router>
      <WebSocketProvider>
        <div className="App">
          <Routes>
            {/* Landing page is the game mode selector */}
            <Route path="/" element={<GameModeSelector />} />

            {/* Game start pages */}
            <Route path="/local/start" element={<LocalGameStart />} />
            <Route path="/online-multiplayer/start" element={<MultiplayerGameStart />} />
            
            {/* Lobby */}
            <Route path="/online-multiplayer/room" element={<MultiplayerLobby />} />

            {/* Actual game pages */}
            <Route path="/local" element={<LocalPlay />} />
            <Route path="/online-multiplayer" element={<OnlinePlay />} />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </WebSocketProvider>
    </Router>
  );
}

export default App;
