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
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="custom-button"
            style={{ 
              color: '#1e293b',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            Back
          </Button>
        )}
        <div>
          <Title level={2} style={{ color: '#1e293b', margin: 0 }}>
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

export default PageHeader;
