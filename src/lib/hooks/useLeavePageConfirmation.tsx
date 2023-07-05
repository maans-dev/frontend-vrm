import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CanvassingContext } from '@lib/context/canvassing.context';

export const useLeavePageConfirmation = (
  shouldPreventLeaving: boolean,
  message = 'You have unsaved changes - are you sure you wish to leave this page?'
) => {
  const router = useRouter();
  const { isSubmitting, isComplete } = useContext(CanvassingContext);

  useEffect(() => {
    const handleWindowClose = e => {
      if (!shouldPreventLeaving) return;
      e.preventDefault();
      return (e.returnValue = message);
    };
    const handleBrowseAway = () => {
      if (!shouldPreventLeaving) return;
      if (window.confirm(message)) return;
    };

    window.addEventListener('beforeunload', handleWindowClose);
    if (isSubmitting !== true && isComplete !== true) {
      router.events.on('routeChangeStart', handleBrowseAway);
    }

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [shouldPreventLeaving, isSubmitting, isComplete]);
};
