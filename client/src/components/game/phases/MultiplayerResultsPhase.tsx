import React, { useState } from 'react';
import { Card, Typography, Button, Space, Tabs, Avatar, Divider } from 'antd';
import { SoundOutlined, HomeOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MultiplayerResultsPhaseProps {
  gameSummaryFiles: any[][][];
  playerNames?: Record<string, string>;
  onPlayAudio: (url: string) => void;
  onBackToHome: () => void;
}

const MultiplayerResultsPhase: React.FC<MultiplayerResultsPhaseProps> = ({
  gameSummaryFiles,
  playerNames = {},
  onPlayAudio,
  onBackToHome
}) => {

  // Extract original creators from gameSummaryFiles
  // Each outer array element is a different starting player's progression
  const originalCreators = gameSummaryFiles.map((playerProgression, index) => {
    const firstEntry = playerProgression[0];
    if (firstEntry) {
      const [playerId] = firstEntry;
      return {
        id: playerId,
        name: playerNames[playerId] || `Player ${playerId.slice(0, 8)}`,
        progressionIndex: index
      };
    }
    return null;
  }).filter((creator): creator is { id: string, name: string, progressionIndex: number } => creator !== null);

  console.log('originalCreators', originalCreators);


  const [selectedCreator, setSelectedCreator] = useState(originalCreators[0]?.id || '');


  const renderClipProgression = (originalCreatorId: string) => {
    // Find the creator's progression
    const creatorInfo = originalCreators.find(c => c.id === originalCreatorId);
    if (!creatorInfo) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            Creator not found.
          </Text>
        </div>
      );
    }

    // Just go through their progression in order
    const playerProgression = gameSummaryFiles[creatorInfo.progressionIndex];
    const clipProgression = playerProgression.map((entry, roundIndex) => {
      const [playerId, originalFile, reversedFile] = entry;
      return {
        round: roundIndex + 1,
        originalFile,
        reversedFile,
        playerId,
        isOriginalCreator: roundIndex === 0
      };
    });
    
    if (clipProgression.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            No progression found for this creator's clip.
          </Text>
        </div>
      );
    }

    return (
      <div style={{ padding: '12px 0' }}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {clipProgression.map((entry, index) => (
            <Card
              key={index}
              size="small"
              style={{
                background: entry.isOriginalCreator 
                  ? 'rgba(139, 92, 246, 0.1)' 
                  : 'rgba(255, 255, 255, 0.95)',
                border: entry.isOriginalCreator 
                  ? '2px solid rgba(139, 92, 246, 0.4)' 
                  : '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>
                  Round {entry.round}
                  {entry.isOriginalCreator && (
                    <Text style={{ color: '#7c3aed', marginLeft: '8px', fontSize: '16px', fontWeight: '600' }}>
                      (Original Creator)
                    </Text>
                  )}
                  {!entry.isOriginalCreator && (
                    <Text style={{ color: '#6b7280', marginLeft: '8px', fontSize: '14px' }}>
                      by {playerNames[entry.playerId] || `Player ${entry.playerId.slice(0, 8)}`}
                    </Text>
                  )}
                </Text>
              </div>
              
              <Space size={12}>
                {entry.originalFile && (
                  <Button
                    onClick={() => entry.originalFile && onPlayAudio(entry.originalFile)}
                    icon={<SoundOutlined />}
                    size="middle"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '10px',
                      height: '40px',
                      padding: '0 20px',
                      fontSize: '15px',
                      fontWeight: '500'
                    }}
                  >
                    🎵 Original
                  </Button>
                )}
                {entry.reversedFile && (
                  <Button
                    onClick={() => entry.reversedFile && onPlayAudio(entry.reversedFile)}
                    icon={<SoundOutlined />}
                    size="middle"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '10px',
                      height: '40px',
                      padding: '0 20px',
                      fontSize: '15px',
                      fontWeight: '500'
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

  const renderCreatorTabs = () => {
    const tabItems = originalCreators.map(creator => ({
      key: creator.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar 
            size="small"
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#8b5cf6'
            }} 
          />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{creator.name}</div>
            <div style={{ fontSize: '12px', color: '#374151', fontWeight: '600' }}>
              Progression {creator.progressionIndex + 1}
            </div>
          </div>
        </div>
      ),
      children: (
        <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
          {renderClipProgression(creator.id)}
        </div>
      )
    }));

    return (
      <Tabs
        activeKey={selectedCreator}
        onChange={(key) => setSelectedCreator(key)}
        items={tabItems}
        centered
      />
    );
  };

  return (
    <Card className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-5">
        <Title level={2} style={{ color: '#1f2937', marginBottom: '0.5rem', fontWeight: '600' }}>
          <TrophyOutlined style={{ marginRight: '8px', color: '#f59e0b' }} />
          Game Results
        </Title>
      </div>

      {originalCreators.length > 0 ? (
        <>
          {renderCreatorTabs()}
          
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
          size="middle"
          icon={<HomeOutlined />}
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            border: 'none',
            color: 'white',
            height: '44px',
            fontSize: '16px',
            padding: '0 24px',
            borderRadius: '12px',
            fontWeight: '500'
          }}
        >
          Back to Lobby
        </Button>
      </div>
    </Card>
  );
};

export default MultiplayerResultsPhase;
