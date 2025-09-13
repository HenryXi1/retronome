import React from 'react';
import PageHeader from './PageHeader';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  backgroundClass?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backPath = '/',
  backgroundClass = 'game-background',
  children
}) => {
  return (
    <div className={`min-h-screen ${backgroundClass} relative`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backPath={backPath}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1200px',
          padding: '24px'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
