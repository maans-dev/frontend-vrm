import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect } from 'react';

const AuthHandler: FunctionComponent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (router.asPath.includes('/auth')) return;

    if (status === 'loading' || status === 'authenticated') return;

    signIn('da', { callbackUrl: router.asPath }); // Force sign in to hopefully resolve error

    // if (session?.error === 'RefreshAccessTokenError') {
    //   appsignal.sendError(new Error(`RefreshAccessTokenError`), span => {
    //     span.setAction('api-call');
    //     span.setParams({
    //       user: session?.user?.darn,
    //     });
    //     span.setTags({ user_darn: session?.user?.darn?.toString() });
    //   });
    //   // signIn('da', { redirect: false }); // Force sign in to hopefully resolve error
    // }
  }, [router.asPath, session, status]);

  return null;
};

export default AuthHandler;
