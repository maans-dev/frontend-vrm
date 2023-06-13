import { useEffect, useRef, useState } from 'react';

export const useStickyVoterInfo = () => {
  const offsetTopRefEl = useRef<HTMLDivElement>();
  const [offsetTop, setOffsetTop] = useState(undefined);

  useEffect(() => {
    setOffsetTop(offsetTopRefEl.current?.offsetTop);
  }, [offsetTopRefEl?.current]);

  useEffect(() => {
    const handleResize = () => {
      setOffsetTop(offsetTopRefEl.current?.offsetTop);
    };
    window.addEventListener('resize', handleResize, false);

    return () => {
      // cleanup
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);

  return { offsetTopRefEl, offsetTop };
};
