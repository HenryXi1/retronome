import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backPath = '/'
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <div className="relative flex items-center justify-center p-6" style={{ marginTop: '20px' }}>
      {showBackButton && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="custom-button"
          style={{
            position: 'absolute',
            left: '24px',
            color: '#1e293b',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Back
        </Button>
      )}
      <div style={{ textAlign: 'center' }}>
        <Title level={2} style={{
          color: '#1e293b',
          margin: 0,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }}>
          {title}
        </Title>
        {subtitle && (
          <Typography.Text style={{
            color: '#1e293b',
            fontSize: '1.1rem',
            marginTop: '8px',
            display: 'block',
            fontWeight: '600',
          }}>
            {subtitle}
          </Typography.Text>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
