import React, { useState } from 'react';
import { Button, Typography, Space, Card, Input, Row, Col, Select } from 'antd';
import { PlayCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../shared/PageLayout';
import { GAME_MODE_INFO, TIMER_OPTIONS } from './constants';

const { Title, Paragraph } = Typography;

interface GameStartPageProps {
  gameMode: 'local' | 'online-multiplayer';
}

const GameStartPage: React.FC<GameStartPageProps> = ({ gameMode }) => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [recordingTimer, setRecordingTimer] = useState(30); // Default 30 seconds


  const handleStartGame = () => {

    // TODO: store this in the backend
    // Store player names and timer in localStorage to pass to game
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    localStorage.setItem('recordingTimer', recordingTimer.toString());
    navigate(`/${gameMode}`);
  };
  const gameInfo = GAME_MODE_INFO[gameMode];

  return (
    <PageLayout
      title={gameInfo.title}
      backPath="/"
      backgroundClass="setup-background"
    >
      <div className="glass-card w-full" style={{ padding: '48px' }}>
        <Row gutter={[24, 24]}>
          {/* Left side - How to Play */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="text-center" style={{ marginTop: '1.5rem' }}>
                <Title level={2} style={{
                  color: '#4c1d95',
                  marginBottom: '1rem',
                  fontWeight: '700',
                  fontSize: '2.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}>
                  How to Play
                </Title>
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
          <Col xs={24} lg={12}>
            <Card style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              height: '100%'
            }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="text-center">
                  <Title level={3} style={{
                    color: '#4c1d95',
                    marginBottom: '1rem',
                    fontWeight: '700',
                    fontSize: '2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px'
                  }}>
                    Player Setup
                  </Title>
                </div>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#ffffff',
                      fontWeight: '600'
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
                      color: '#ffffff',
                      fontWeight: '600'
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
                      color: '#ffffff',
                      fontWeight: '600'
                    }}>
                      <ClockCircleOutlined style={{ marginRight: '8px', color: '#ffffff' }} />
                      Turn Length
                    </label>
                    <Select
                      size="large"
                      value={recordingTimer}
                      onChange={setRecordingTimer}
                      options={TIMER_OPTIONS}
                      style={{ width: '100%' }}
                      className="custom-input"
                    />
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
