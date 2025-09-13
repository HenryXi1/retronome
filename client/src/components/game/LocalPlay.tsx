import React from 'react';
import GenericGameFlow from './GenericGameFlow';
import { useLocalGameController } from './controllers';

const LocalPlay: React.FC = () => {
  const controller = useLocalGameController();

  return <GenericGameFlow controller={controller} />;
};

export default LocalPlay;