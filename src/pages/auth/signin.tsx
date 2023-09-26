import MainLayout from '@layouts/main';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Signin = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('da');
    } else if (status === 'authenticated') {
      void router.push('/');
    }
  }, [router, status]);

  return <MainLayout panelled={false} restrictWidth={false} showSpinner />;
};

export default Signin;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   // If the user is already logged in, redirect.
//   if (session) {
//     return { redirect: { destination: '/' } };
//   }
//   return { props: {} };
// }
