import MainLayout from '@layouts/main';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';

const RouteGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) => {
  const { children } = props;
  const [moduleEnabled, setModuleEnabled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' && !router.asPath.includes('/auth')) {
      return;
    }

    if (router.asPath.includes('/auth')) {
      setModuleEnabled(true);
      return;
    }

    const hasFeature = (feature: string) => session?.features.includes(feature);

    const featureFlagCheck = () => {
      let enabled = false;

      if (hasFeature('maintenance-mode')) {
        setModuleEnabled(false);
        if (router.asPath !== '/') router.push('/');
        return;
      }

      if (router.asPath === '/') {
        enabled = true;
      }

      if (
        router.asPath.includes('/canvass') ||
        router.asPath.includes('/capture')
      ) {
        enabled = hasFeature('capture-module') || hasFeature('canvass-module');
      }

      if (router.asPath.includes('/membership')) {
        enabled = hasFeature('membership-module');
      }

      if (router.asPath.includes('/sheets')) {
        enabled = hasFeature('sheet-gen-module');
      }

      if (router.asPath.includes('/comms')) {
        enabled = hasFeature('bulk-comms-module');
      }

      if (router.asPath.includes('/cleanup')) {
        enabled = hasFeature('cleanup-module');
      }

      if (router.asPath.includes('/my-activity')) {
        enabled = hasFeature('my-activity-module');
      }

      if (router.asPath.includes('/activity-reports')) {
        enabled = hasFeature('activity-reports-module');
      }

      if (!enabled && !router.asPath.includes('404')) {
        setModuleEnabled(false);
        router.push('/');
      } else {
        setModuleEnabled(true);
      }
    };

    featureFlagCheck();

    const preventAccess = () => setModuleEnabled(false);

    router.events.on('routeChangeStart', preventAccess);
    router.events.on('routeChangeComplete', featureFlagCheck);

    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', featureFlagCheck);
    };
  }, [router, router.events, session?.features, status]);

  return moduleEnabled ? (
    children
  ) : (
    <MainLayout breadcrumb={null} panelled={false} showSpinner={true} />
  );
};

export default RouteGuard;
