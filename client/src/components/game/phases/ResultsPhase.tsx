import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { SoundOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { AudioClip } from '../shared/types';

const { Title, Paragraph } = Typography;

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
  onPlayAudio,
  onNextRound,
  onBackToHome
}) => {
  const latestClip = audioClips[audioClips.length - 1];

  return (
    <Card className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          Results
        </Title>
        <Paragraph style={{
          color: '#1e293b',
          fontSize: '1.125rem',
          fontWeight: '600',
        }}>
          Here's how you did this round!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Current Round Result */}
        {latestClip && (
          <div className="glass-card" style={{
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div className="text-center">
              <Space size="large">
                <Button
                  type="primary"
                  onClick={() => latestClip.originalUrl && onPlayAudio(latestClip.originalUrl)}
                  icon={<SoundOutlined />}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none',
                    height: '60px',
                    padding: '0 30px',
                    borderRadius: '30px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  🎵 PLAY ORIGINAL
                </Button>

                {latestClip.reversedUrl && (
                  <Button
                    type="primary"
                    onClick={() => onPlayAudio(latestClip.reversedUrl!)}
                    icon={<SoundOutlined />}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      height: '60px',
                      padding: '0 30px',
                      borderRadius: '30px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    🔄 PLAY REVERSED
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}

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
