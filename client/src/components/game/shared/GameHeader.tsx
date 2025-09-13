import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface GameHeaderProps {
  title: string;
  subtitle?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="custom-button"
          style={{ 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Back
        </Button>
        <div>
          <Title level={2} style={{ 
            color: '#1e293b', 
            margin: 0
          }}>
            {title}
          </Title>
          {subtitle && (
            <Typography.Text style={{ 
              color: '#64748b',
              fontSize: '1rem'
            }}>
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
