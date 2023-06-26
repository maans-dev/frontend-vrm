import { EuiButton, EuiCallOut, EuiImage, EuiPageTemplate } from '@elastic/eui';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Signin = () => {
  const router = useRouter();

  return (
    <EuiPageTemplate minHeight="100vh" panelled={false}>
      <EuiPageTemplate.Section alignment="center">
        <EuiPageTemplate.EmptyPrompt
          paddingSize="l"
          icon={
            <EuiImage size="120px" src="/images/logo-with-text.svg" alt="" />
          }
          title={<h2>VRM Sign in</h2>}
          titleSize="s"
          actions={
            <EuiButton
              fill
              fullWidth
              color="primary"
              onClick={() => signIn('da')}>
              Sign in
            </EuiButton>
          }
          // footer={footer}
        >
          {router?.query?.error && (
            <EuiCallOut
              title={`Something went wrong (${router?.query?.error})`}
              color="danger"
              iconType="error">
              Please try again later.
            </EuiCallOut>
          )}
        </EuiPageTemplate.EmptyPrompt>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
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
