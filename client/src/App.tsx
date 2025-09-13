import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameModeSelector from './components/landing/GameModeSelector';
import GameStartPage from './components/landing/GameStartPage';
import LocalPlay from './components/game/LocalPlay';
import OnlinePlay from './components/game/OnlinePlay';

function App(): React.JSX.Element {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page is the game mode selector */}
          <Route path="/" element={<GameModeSelector />} />
          
          {/* Game start pages */}
          <Route path="/local/start" element={<GameStartPage gameMode="local" />} />
          <Route path="/online-1v1/start" element={<GameStartPage gameMode="online-1v1" />} />
          <Route path="/online-multiplayer/start" element={<GameStartPage gameMode="online-multiplayer" />} />
          
          {/* Actual game pages */}
          <Route path="/local" element={<LocalPlay />} />
          {/* <Route path="/online-1v1" element={<OnlinePlay gameMode="online-1v1" />} />
          <Route path="/online-multiplayer" element={<OnlinePlay gameMode="online-multiplayer" />} /> */}
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
