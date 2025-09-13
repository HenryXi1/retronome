import React, { useState } from 'react';
import { Button, Typography, Space, Card, Input, Row, Col, Slider } from 'antd';
import { PlayCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';

const { Title, Paragraph } = Typography;

interface GameStartPageProps {
  gameMode: 'local' | 'online-1v1' | 'online-multiplayer';
}

const GameStartPage: React.FC<GameStartPageProps> = ({ gameMode }) => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [recordingTimer, setRecordingTimer] = useState(30); // Default 30 seconds

  const handleStartGame = () => {
    // Store player names and timer in localStorage to pass to game
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    localStorage.setItem('recordingTimer', recordingTimer.toString());
    navigate(`/${gameMode}`);
  };
  const getGameModeInfo = () => {
    switch (gameMode) {
      case 'local':
        return {
          title: 'Local Play',
          description: 'Perfect for couch co-op gaming!',
          instructions: [
            'Sit together with a friend',
            'Take turns recording song snippets',
            'Listen to the reversed audio',
            'Try to guess each other\'s songs',
            'See who can guess the most correctly!'
          ],
          icon: '🏠'
        };
      case 'online-1v1':
        return {
          title: 'Online 1v1',
          description: 'Challenge a friend online!',
          instructions: [
            'Share a room code with your friend',
            'Record your song snippets',
            'Listen to each other\'s reversed audio',
            'Make your guesses',
            'Compare scores at the end!'
          ],
          icon: '⚔️'
        };
      case 'online-multiplayer':
        return {
          title: 'Online Multiplayer',
          description: 'Up to 8 players in the chaos!',
          instructions: [
            'Join with up to 8 friends',
            'Everyone records a song snippet',
            'Audio gets passed around and reversed',
            'Watch the chaos unfold',
            'See how badly the songs get distorted!'
          ],
          icon: '🎉'
        };
    }
  };

  const gameInfo = getGameModeInfo();

  return (
    <PageLayout 
      title={`${gameInfo.icon} ${gameInfo.title}`}
      subtitle={gameInfo.description}
      backPath="/"
    >
        <div className="glass-card p-8 max-w-6xl w-full">
          <Row gutter={[32, 32]}>
            {/* Left side - How to Play */}
            <Col xs={24} lg={14}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="text-center">
                  <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
                    How to Play
                  </Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '1.125rem', margin: 0 }}>
                    Get ready for the musical chaos! Here's how the game works:
                  </Paragraph>
                </div>

                <Card
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px'
                  }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {gameInfo.instructions.map((instruction, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <Paragraph style={{ color: '#1e293b', margin: 0, fontSize: '1rem' }}>
                          {instruction}
                        </Paragraph>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Space>
            </Col>

            {/* Right side - Player Setup */}
            <Col xs={24} lg={10}>
              <Card style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                height: '100%'
              }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className="text-center">
                    <Title level={3} style={{ color: '#1e40af', marginBottom: '1rem' }}>
                      🎯 Player Setup
                    </Title>
                    <Paragraph style={{ color: '#64748b' }}>
                      Enter player names to start the game!
                    </Paragraph>
                  </div>

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        Player 1 Name
                      </label>
                      <Input
                        size="large"
                        placeholder="Enter Player 1's name"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        prefix={<UserOutlined />}
                        className="custom-input"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        Player 2 Name
                      </label>
                      <Input
                        size="large"
                        placeholder="Enter Player 2's name"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        prefix={<UserOutlined />}
                        className="custom-input"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        <ClockCircleOutlined style={{ marginRight: '8px' }} />
                        Recording Timer: {recordingTimer}s
                      </label>
                      <Slider
                        min={10}
                        max={60}
                        step={5}
                        value={recordingTimer}
                        onChange={setRecordingTimer}
                        tooltip={{ formatter: (value) => `${value}s` }}
                        style={{ margin: '0 8px' }}
                        trackStyle={{ background: '#3b82f6' }}
                        handleStyle={{ borderColor: '#3b82f6' }}
                        railStyle={{ background: 'rgba(59, 130, 246, 0.2)' }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '12px', 
                        color: '#64748b',
                        marginTop: '4px'
                      }}>
                        <span>10s</span>
                        <span>60s</span>
                      </div>
                    </div>
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
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
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
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
    </PageLayout>
  );
};

export default GameStartPage;
