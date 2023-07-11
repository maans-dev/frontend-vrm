import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

export const useAnalytics = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const hasFeature = (feature: string, session: Session) =>
    session?.features?.includes(feature);

  const initializeAnalytics = (trackingId: string) => {
    if (!isInitialized && hasFeature('google-analytics', session)) {
      ReactGA.initialize(trackingId);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    const setPageView = (url: string) => {
      ReactGA.set({ page: url });
      ReactGA.send({ hitType: 'pageview', page: url, title: document.title });
    };
    if (isInitialized && hasFeature('google-analytics', session)) {
      router.events.on('routeChangeComplete', setPageView);
    }

    return () => {
      router.events.off('routeChangeComplete', setPageView);
    };
  }, [isInitialized, router, session]);

  const trackPageClick = (url: string) => {
    if (hasFeature('google-analytics', session)) {
      ReactGA.event({
        category: 'Page Click',
        action: 'Clicked',
        label: url,
      });
    }
  };

  const trackUserLogout = () => {
    if (hasFeature('google-analytics', session)) {
      ReactGA.event({
        category: 'User',
        action: 'Logged Out',
      });
    }
  };

  const trackCustomEvent = (
    category: string,
    action: string,
    label?: string
  ) => {
    if (hasFeature('google-analytics', session)) {
      ReactGA.event({
        category,
        action,
        label,
      });
    }
  };

  return {
    initializeAnalytics,
    trackCustomEvent,
    trackUserLogout,
    trackPageClick,
  };
};
