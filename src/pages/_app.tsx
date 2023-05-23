import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { FunctionComponent, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Global } from '@emotion/react';
import Chrome from '../components/chrome';
import { Theme } from '../components/theme';
import { globalStyes } from '../styles/global.styles';
import CanvassingProvider from '@lib/context/canvassing.context';
import ToastProvider from '@lib/context/toast.context';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import AuthHandler from '@components/auth/auth-handler';
import { ErrorBoundary } from '@appsignal/react';
import Appsignal from '@appsignal/javascript';
import { plugin as appSignalBreadcrumbsNetwork } from '@appsignal/plugin-breadcrumbs-network';
import { plugin } from '@appsignal/plugin-window-events';

/**
 * Next.js uses the App component to initialize pages. You can override it
 * and control the page initialization. Here use use it to render the
 * `Chrome` component on each page, and apply an error boundary.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
const EuiApp: FunctionComponent<AppProps<{ session: Session }>> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const appsignal = new Appsignal({
    key: process.env.NEXT_PUBLIC_APPSIGNAL,
    revision: process.env.NEXT_PUBLIC_VERSION,
  });
  useEffect(() => {
    appsignal.use(appSignalBreadcrumbsNetwork());
    appsignal.use(plugin());
  }, []);
  return (
    <>
      <Head>
        {/* You can override this in other pages - see index.tsx for an example */}
        <title>VRM</title>
      </Head>
      <Global styles={globalStyes} />
      <Theme>
        <Chrome>
          <SessionProvider
            session={session}
            refetchInterval={60} // refresh session every 60 seconds
            refetchOnWindowFocus={true}>
            <ToastProvider>
              <CanvassingProvider>
                <ErrorBoundary instance={appsignal}>
                  <AuthHandler />
                  <Component {...pageProps} />
                </ErrorBoundary>
              </CanvassingProvider>
            </ToastProvider>
          </SessionProvider>
        </Chrome>
      </Theme>
    </>
  );
};

export default EuiApp;
