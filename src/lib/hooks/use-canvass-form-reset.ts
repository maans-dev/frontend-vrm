import { CanvassingContext } from '@lib/context/canvassing.context';
import { useContext, useEffect, useState } from 'react';

export function useCanvassFormReset(resetFunc: () => void) {
  const { doFormReset } = useContext(CanvassingContext);
  const [prev, setPrev] = useState(doFormReset);

  useEffect(() => {
    if (doFormReset !== prev) {
      resetFunc();
      setPrev(doFormReset);
    }
  }, [doFormReset, prev, resetFunc]);
}
