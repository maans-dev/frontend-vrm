import { appsignal } from '@lib/appsignal';
import { ToastContext } from '@lib/context/toast.context';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FunctionComponent, useContext } from 'react';
import { SWRConfig } from 'swr';

const SwrGlobalErrorHandler: FunctionComponent = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToast } = useContext(ToastContext);

  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          // console.log(error, key);
          if (error?.cause?.cause?.status === 401) {
            addToast({
              id: 'Authentication error',
              title: 'Attempting to re-authenticate',
              color: 'warning',
            });
            signIn('da', { callbackUrl: router.asPath }); // Force sign in to hopefully resolve error
            return;
          }
          const endpoint: string =
            error?.cause?.cause?.route?.split('?')?.[0] || 'unknown';

          if (
            error?.cause?.cause?.status === 403 &&
            endpoint.includes('/activity/report')
          ) {
            // prevent these specific errors from being logged to appsignal #https://source.da-io.net/vrm-revamp/frontend/-/issues/212
            return;
          }

          appsignal.sendError(error, span => {
            span.setAction(`swr-global:api:${endpoint}`);
            span.setParams({
              cause: error?.cause?.cause || error,
            });
            span.setTags({
              user_darn: session?.user?.darn?.toString(),
              route: key,
            });
          });
        },
      }}>
      {children}
    </SWRConfig>
  );
};

export default SwrGlobalErrorHandler;
