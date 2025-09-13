import React, { useState } from 'react';

interface OnlinePlayProps {
  gameMode: 'online-1v1' | 'online-multiplayer';
  onBack: () => void;
}

const OnlinePlay: React.FC<OnlinePlayProps> = ({ gameMode, onBack }) => {
  const [currentView, setCurrentView] = useState<'create-join' | 'waiting' | 'game'>('create-join');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);

  const createRoom = () => {
    // Generate a random room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsHost(true);
    setCurrentView('waiting');
  };

  const joinRoom = () => {
    if (roomCode.trim() && playerName.trim()) {
      setIsHost(false);
      setCurrentView('waiting');
    }
  };

  const startGame = () => {
    setCurrentView('game');
  };

  if (currentView === 'create-join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="text-white/70 hover:text-white mb-4 text-left"
            >
              ← Back to Game Modes
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">
              {gameMode === 'online-1v1' ? 'Online 1v1' : 'Online Multiplayer'}
            </h1>
            <p className="text-white/80">
              {gameMode === 'online-1v1'
                ? 'Challenge a friend to a musical duel!'
                : 'Join the chaos with up to 8 players!'
              }
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Create a Room</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                />
                <button
                  onClick={createRoom}
                  disabled={!playerName.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Create Room
                </button>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <h2 className="text-xl font-bold text-white mb-4">Join a Room</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                />
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30"
                />
                <button
                  onClick={joinRoom}
                  disabled={!playerName.trim() || !roomCode.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentView('create-join')}
              className="text-white/70 hover:text-white mb-4 text-left"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Waiting Room</h1>
            <p className="text-white/80">Room Code: <span className="font-bold text-2xl">{roomCode}</span></p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Players ({gameMode === 'online-1v1' ? '2' : '2-8'})</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <span className="text-white font-bold">{playerName} {isHost && '(You - Host)'}</span>
                  <span className="text-green-400">✓ Ready</span>
                </div>
                {!isHost && (
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-white/60">Waiting for players...</span>
                    <span className="text-yellow-400">⏳</span>
                  </div>
                )}
              </div>
            </div>

            {isHost && (
              <div className="text-center">
                <button
                  onClick={startGame}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  Start Game
                </button>
              </div>
            )}

            {!isHost && (
              <div className="text-center">
                <p className="text-white/80">Waiting for host to start the game...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game view - now using the modularized components!
  if (currentView === 'game') {
    // In a real implementation, you'd get these from your multiplayer backend
    const gameId = 'example-game-id';
    const playerId = 'current-player-id';
    const players = [
      { id: 'player1', name: playerName },
      { id: 'player2', name: 'Other Player' }
    ];

    // You can now use the same UI components as local play!
    // Just need to import and implement the multiplayer controller
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Game Ready!</h1>
          <p className="text-white/80 mb-6">
            When you implement the multiplayer controller, you can use the exact same Recording and Reversing UI components!
          </p>
          <button
            onClick={() => setCurrentView('create-join')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OnlinePlay;
