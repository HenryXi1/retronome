import React from 'react';
import { Card, Typography, Button, Space, Progress } from 'antd';
import { SyncOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ReversingPhaseProps {
  isReversing: boolean;
  onStartReversing: () => void;
  onNextPhase: () => void;
}

const ReversingPhase: React.FC<ReversingPhaseProps> = ({
  isReversing,
  onStartReversing,
  onNextPhase
}) => {
  return (
    <Card className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="text-center mb-6">
        <Title level={2} style={{ color: '#1e293b', marginBottom: '1rem' }}>
          🔄 Reversing Phase
        </Title>
        <Paragraph style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Processing your audio... This might take a moment!
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Reversing Animation */}
        <div className="text-center">
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            animation: isReversing ? 'spin 2s linear infinite' : 'none'
          }}>
            <SyncOutlined />
          </div>
          
          {isReversing ? (
            <div>
              <Progress 
                percent={100} 
                strokeColor="#8b5cf6"
                showInfo={false}
                style={{ maxWidth: '300px', margin: '0 auto' }}
              />
              <Paragraph style={{ color: '#64748b', marginTop: '1rem' }}>
                Reversing audio... 🎵➡️🎶
              </Paragraph>
            </div>
          ) : (
            <div>
              <Title level={3} style={{ color: '#1e293b', marginBottom: '1rem' }}>
                Ready to Reverse! 🎉
              </Title>
              <Paragraph style={{ color: '#64748b' }}>
                Click the button below to start the audio reversal process.
              </Paragraph>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="text-center">
          {!isReversing ? (
            <Button
              type="primary"
              onClick={onStartReversing}
              className="large-button"
              size="large"
              icon={<SyncOutlined />}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                height: '64px',
                fontSize: '20px',
                padding: '0 32px',
                borderRadius: '20px'
              }}
            >
              Start Reversing
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={onNextPhase}
              className="large-button"
              size="large"
              icon={<ArrowRightOutlined />}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                height: '64px',
                fontSize: '20px',
                padding: '0 32px',
                borderRadius: '20px'
              }}
            >
              Continue to Guessing
            </Button>
          )}
        </div>

        {/* Info Card */}
        <Card style={{ 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px'
        }}>
          <Paragraph style={{ 
            color: '#7c3aed', 
            margin: 0, 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            🔮 <strong>Magic happening!</strong> We're reversing your audio to make it mysterious and fun to guess!
          </Paragraph>
        </Card>
      </Space>
    </Card>
  );
};

export default ReversingPhase;
