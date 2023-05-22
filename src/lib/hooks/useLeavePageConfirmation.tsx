import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useLeavePageConfirmation = (
  shouldPreventLeaving: boolean,
  message = 'You have unsaved changes - are you sure you wish to leave this page?'
) => {
  const router = useRouter();

  useEffect(() => {
    const handleWindowClose = e => {
      if (!shouldPreventLeaving) return;
      e.preventDefault();
      return (e.returnValue = message);
    };
    const handleBrowseAway = () => {
      if (!shouldPreventLeaving) return;
      if (window.confirm(message)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [shouldPreventLeaving]);
};
