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
import { appsignal, initAppsignal } from '@lib/appsignal';
import SwrGlobalErrorHandler from '@components/error/swr-global-error-handler';
import RouteGuard from '@components/route-guard';
import { EuiButton, EuiButtonEmpty, EuiEmptyPrompt } from '@elastic/eui';
import router from 'next/router';

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
  // Initialize appsignal plugins. TODO: Could this be handled better?
  useEffect(() => {
    initAppsignal();
  }, []);

  return (
    <>
      <Head>
        {/* You can override this in other pages - see index.tsx for an example */}
        <title>VRM</title>
      </Head>
      <Global styles={globalStyes} />
      <SessionProvider
        session={session}
        refetchInterval={60} // refresh session every 60 seconds
        refetchOnWindowFocus={true}>
        <ToastProvider>
          <SwrGlobalErrorHandler>
            <Theme>
              <Chrome>
                <CanvassingProvider>
                  <ErrorBoundary
                    instance={appsignal}
                    fallback={error => (
                      <EuiEmptyPrompt
                        color="danger"
                        iconType="error"
                        title={<h2>Something went wrong.</h2>}
                        body={
                          <>
                            <p>{error?.message}</p>
                          </>
                        }
                        actions={[
                          <EuiButton
                            key={1}
                            fill
                            onClick={() => window.location.replace('/')}>
                            Return to home page
                          </EuiButton>,
                          <EuiButtonEmpty
                            key={2}
                            onClick={() => window.location.reload()}>
                            Try again
                          </EuiButtonEmpty>,
                        ]}
                      />
                    )}>
                    <AuthHandler />
                    <RouteGuard>
                      <Component {...pageProps} />
                    </RouteGuard>
                  </ErrorBoundary>
                </CanvassingProvider>
              </Chrome>
            </Theme>
          </SwrGlobalErrorHandler>
        </ToastProvider>
      </SessionProvider>
    </>
  );
};

export default EuiApp;
