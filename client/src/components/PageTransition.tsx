
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  currentPath: string;
}

export default function PageTransition({ children, currentPath }: PageTransitionProps) {
  const [displayPath, setDisplayPath] = useState(currentPath);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (currentPath !== displayPath) {
      setTransitionStage('fadeOut');
    }
  }, [currentPath, displayPath]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      }`}
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayPath(currentPath);
          setTransitionStage('fadeIn');
        }
      }}
    >
      {children}
    </div>
  );
}
