import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { FunctionComponent } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { EuiErrorBoundary } from '@elastic/eui';
import { Global } from '@emotion/react';
import Chrome from '../components/chrome';
import { Theme } from '../components/theme';
import { globalStyes } from '../styles/global.styles';
import CanvassingProvider from '@lib/context/canvassing.context';
import ToastProvider from '@lib/context/toast.context';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import AuthHandler from '@components/auth/auth-handler';

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
                <EuiErrorBoundary>
                  <AuthHandler />
                  <Component {...pageProps} />
                </EuiErrorBoundary>
              </CanvassingProvider>
            </ToastProvider>
          </SessionProvider>
        </Chrome>
      </Theme>
    </>
  );
};

export default EuiApp;
