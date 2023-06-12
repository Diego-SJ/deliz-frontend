import { useState, useEffect } from 'react';

const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPhablet, setIsPhablet] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 600px)');
    const isTablet = window.matchMedia('(max-width: 768px)');
    const isPhablet = window.matchMedia('(max-width: 992px)');

    const handleMQMobileChange = (event: any) => {
      setIsMobile(event.matches);
    };

    const handleMQTabletChange = (event: any) => {
      setIsTablet(event.matches);
    };

    const handleMQPhabletChange = (event: any) => {
      setIsPhablet(event.matches);
    };

    isMobile.addEventListener('change', handleMQMobileChange);
    isTablet.addEventListener('change', handleMQTabletChange);
    isPhablet.addEventListener('change', handleMQPhabletChange);

    setIsMobile(isMobile.matches);
    setIsTablet(isTablet.matches);
    setIsPhablet(isPhablet.matches);

    return () => {
      isMobile.removeEventListener('change', handleMQMobileChange);
      isTablet.removeEventListener('change', handleMQTabletChange);
      isPhablet.removeEventListener('change', handleMQPhabletChange);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isPhablet,
  };
};

export default useMediaQuery;
