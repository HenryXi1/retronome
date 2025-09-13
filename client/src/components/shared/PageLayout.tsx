import React from 'react';
import PageHeader from './PageHeader';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  showBackButton = true,
  backPath = '/',
  children
}) => {
  return (
    <div className="min-h-screen game-background">
      <PageHeader
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backPath={backPath}
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
