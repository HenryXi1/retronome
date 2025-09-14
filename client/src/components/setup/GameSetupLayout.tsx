import React from 'react';
import { Typography, Space, Card, Row, Col } from 'antd';
import PageLayout from '../shared/PageLayout';
import { GAME_MODE_INFO } from '../landing/constants';

const { Title, Paragraph } = Typography;

interface GameSetupLayoutProps {
  gameMode: 'local' | 'online-multiplayer';
  setupTitle: string;
  setupContent: React.ReactNode;
}

const GameSetupLayout: React.FC<GameSetupLayoutProps> = ({ 
  gameMode, 
  setupTitle, 
  setupContent 
}) => {
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

          {/* Right side - Setup Content */}
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
                    {setupTitle}
                  </Title>
                </div>

                {setupContent}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
};

export default GameSetupLayout;
