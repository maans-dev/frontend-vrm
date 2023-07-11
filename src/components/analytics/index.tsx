import { useAnalytics } from '@lib/hooks/useAnalytics';
import { FunctionComponent } from 'react';

const Analytics: FunctionComponent = () => {
  // Initialize Google Analytics with the tracking ID
  const { initializeAnalytics } = useAnalytics();
  initializeAnalytics(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return <></>;
};

export default Analytics;
