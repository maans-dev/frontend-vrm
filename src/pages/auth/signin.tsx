import { EuiButton, EuiImage, EuiPageTemplate } from '@elastic/eui';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';

const Signin = () => {
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
              onClick={() => signIn('da', { redirect: false })}>
              Sign in
            </EuiButton>
          }
          // footer={footer}
        />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default Signin;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: '/' } };
  }
  return { props: {} };
}
