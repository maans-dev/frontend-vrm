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
            console.log('SwrGlobalErrorHandler', router.asPath, router);
            signIn('da', { callbackUrl: router.asPath }); // Force sign in to hopefully resolve error
            return;
          }
          const endpoint = error.cause.cause.route.split('?')[0];
          appsignal.sendError(error, span => {
            span.setAction(`api:${endpoint}`);
            span.setParams({
              cause: error.cause.cause,
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
