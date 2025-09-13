import React from 'react';
import { Card, Typography, Button, Space, Row, Col } from 'antd';
import { SoundOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { AudioClip } from '../shared/types';

const { Title, Paragraph, Text } = Typography;

interface ResultsPhaseProps {
  audioClips: AudioClip[];
  player1Name: string;
  player2Name: string;
  onPlayAudio: (url: string) => void;
  onNextRound: () => void;
  onBackToHome: () => void;
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({
  audioClips,
  player1Name,
  player2Name,
  onPlayAudio,
  onNextRound,
  onBackToHome
}) => {
  const latestClip = audioClips[audioClips.length - 1];
  const isCorrect = latestClip?.isCorrect;
  const correctCount = audioClips.filter(clip => clip.isCorrect).length;
  const totalRounds = audioClips.length;

  return (
    <Card className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🏆 Results
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Here's how you did this round!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Current Round Result */}
        {latestClip && (
          <Card style={{ 
            background: isCorrect 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '16px'
          }}>
            <div className="text-center">
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem' 
              }}>
                {isCorrect ? '🎉' : '😅'}
              </div>
              
              <Title level={3} style={{ 
                color: isCorrect ? '#059669' : '#dc2626',
                marginBottom: '1rem'
              }}>
                {isCorrect ? 'Correct!' : 'Not quite right!'}
              </Title>
              
              <Row gutter={[16, 16]} justify="center">
                <Col span={12}>
                  <Card style={{ 
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '12px'
                  }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong style={{ color: '#1e293b' }}>Original Song:</Text>
                      <Text style={{ color: '#64748b' }}>{latestClip.originalSong}</Text>
                    </Space>
                  </Card>
                </Col>
                
                <Col span={12}>
                  <Card style={{ 
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '12px'
                  }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong style={{ color: '#1e293b' }}>Your Guess:</Text>
                      <Text style={{ color: '#64748b' }}>{latestClip.guess}</Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
              
              <div style={{ marginTop: '1rem' }}>
                <Button
                  type="text"
                  onClick={() => latestClip.originalUrl && onPlayAudio(latestClip.originalUrl)}
                  icon={<SoundOutlined />}
                  style={{ 
                    color: '#64748b',
                    marginRight: '1rem'
                  }}
                >
                  Original
                </Button>
                {latestClip.reversedUrl && (
                  <Button
                    type="text"
                    onClick={() => onPlayAudio(latestClip.reversedUrl!)}
                    icon={<SoundOutlined />}
                    style={{ color: '#64748b' }}
                  >
                    Reversed
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Game Statistics */}
        <Card style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px'
        }}>
          <div className="text-center">
            <Title level={4} style={{ color: '#1e40af', marginBottom: '1rem' }}>
              📊 Game Statistics
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>
                  <Text strong style={{ color: '#1e40af', fontSize: '1.5rem' }}>
                    {totalRounds}
                  </Text>
                  <br />
                  <Text style={{ color: '#64748b' }}>Rounds Played</Text>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Text strong style={{ color: '#1e40af', fontSize: '1.5rem' }}>
                    {correctCount}
                  </Text>
                  <br />
                  <Text style={{ color: '#64748b' }}>Correct Guesses</Text>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <Text strong style={{ color: '#1e40af', fontSize: '1.5rem' }}>
                    {totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0}%
                  </Text>
                  <br />
                  <Text style={{ color: '#64748b' }}>Accuracy</Text>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <Space size="middle">
            <Button
              type="primary"
              onClick={onNextRound}
              className="large-button"
              size="large"
              icon={<ArrowRightOutlined />}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                height: '56px',
                fontSize: '18px',
                padding: '0 24px',
                borderRadius: '16px'
              }}
            >
              Next Round
            </Button>
            
            <Button
              onClick={onBackToHome}
              className="large-button"
              size="large"
              icon={<HomeOutlined />}
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                color: 'white',
                height: '56px',
                fontSize: '18px',
                padding: '0 24px',
                borderRadius: '16px'
              }}
            >
              Back to Home
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ResultsPhase;
