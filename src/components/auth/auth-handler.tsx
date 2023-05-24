import { appsignal } from '@lib/appsignal';
import { signIn, useSession } from 'next-auth/react';
import { FunctionComponent, useEffect } from 'react';

const AuthHandler: FunctionComponent = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      appsignal.sendError(new Error(`RefreshAccessTokenError`), span => {
        span.setAction('api-call');
        span.setParams({
          user: session?.user?.darn,
        });
        span.setTags({ user_darn: session?.user?.darn?.toString() });
      });
      signIn('da', { redirect: false }); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return null;
};

export default AuthHandler;
