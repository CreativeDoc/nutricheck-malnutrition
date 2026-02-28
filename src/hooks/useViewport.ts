import { useEffect } from 'react';

function setVhProperty() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function useViewport() {
  useEffect(() => {
    setVhProperty();

    const onResize = () => setVhProperty();

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => {
      // Delay to let the browser finish rotating
      setTimeout(setVhProperty, 100);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
}
