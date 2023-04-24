import { signIn, useSession } from 'next-auth/react';
import { FunctionComponent, useEffect } from 'react';

const AuthHandler: FunctionComponent = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return null;
};

export default AuthHandler;
