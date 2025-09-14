import React, { useState } from 'react';
import { Card, Typography, Button, Space, Tabs, Avatar, Divider } from 'antd';
import { SoundOutlined, HomeOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { AudioClip } from '../interfaces';

const { Title, Text } = Typography;

interface MultiplayerResultsPhaseProps {
  audioClips: AudioClip[];
  players: { id: string, name: string }[];
  onPlayAudio: (url: string) => void;
  onBackToHome: () => void;
}

const MultiplayerResultsPhase: React.FC<MultiplayerResultsPhaseProps> = ({
  audioClips,
  players,
  onPlayAudio,
  onBackToHome
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id || '');

  // Group audio clips by player
  const clipsByPlayer = audioClips.reduce((acc, clip) => {
    const playerId = clip.playerId || 'unknown';
    if (!acc[playerId]) acc[playerId] = [];
    acc[playerId].push(clip);
    return acc;
  }, {} as Record<string, AudioClip[]>);

  // Sort clips by round for each player
  Object.keys(clipsByPlayer).forEach(playerId => {
    clipsByPlayer[playerId].sort((a, b) => (a.round || 1) - (b.round || 1));
  });

  // Get all rounds for statistics
  const allRounds = [...new Set(audioClips.map(clip => clip.round || 1))].sort((a, b) => a - b);

  const renderPlayerRounds = (playerId: string) => {
    const playerClips = clipsByPlayer[playerId] || [];
    
    if (playerClips.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            No recordings found for this player.
          </Text>
        </div>
      );
    }

    return (
      <div style={{ padding: '16px 0' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {playerClips.map((clip, index) => (
            <Card
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>
                  Round {clip.round || 1}
                </Text>
              </div>
              
              <Space size={16}>
                {clip.originalUrl && (
                  <Button
                    onClick={() => onPlayAudio(clip.originalUrl)}
                    icon={<SoundOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 24px',
                      fontSize: '16px'
                    }}
                  >
                    🎵 Original
                  </Button>
                )}
                {clip.reversedUrl && (
                  <Button
                    onClick={() => onPlayAudio(clip.reversedUrl!)}
                    icon={<SoundOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 24px',
                      fontSize: '16px'
                    }}
                  >
                    🔄 Reversed
                  </Button>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </div>
    );
  };

  const renderPlayerTabs = () => {
    const tabItems = players.map(player => ({
      key: player.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar 
            size="small"
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: clipsByPlayer[player.id]?.length > 0 ? '#6366f1' : '#d1d5db'
            }} 
          />
          {player.name}
        </div>
      ),
      children: (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {renderPlayerRounds(player.id)}
        </div>
      )
    }));

    return (
      <Tabs
        activeKey={selectedPlayer}
        onChange={(key) => setSelectedPlayer(key)}
        items={tabItems}
        centered
      />
    );
  };

  return (
    <Card className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
          <TrophyOutlined style={{ marginRight: '8px', color: '#f59e0b' }} />
          Game Results
        </Title>
      </div>

      {players.length > 0 ? (
        <>
          {renderPlayerTabs()}
          
          <Divider />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            No recordings found for this game.
          </Text>
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center">
        <Button
          onClick={onBackToHome}
          size="large"
          icon={<HomeOutlined />}
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            border: 'none',
            color: 'white',
            height: '56px',
            fontSize: '18px',
            padding: '0 32px',
            borderRadius: '16px'
          }}
        >
          Back to Lobby
        </Button>
      </div>
    </Card>
  );
};

export default MultiplayerResultsPhase;
