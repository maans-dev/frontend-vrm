import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import VoterSearch from '@components/voter-search';
import { getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import { hasRole } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';

const Index: FunctionComponent = () => {
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Data Cleanup',
    },
    {
      text: 'Voter search',
    },
  ];

  return <VoterSearch breadcrumb={breadcrumb} />;
};

// export async function getInitialProps({ req, res }: GetServerSidePropsContext) {
//   const session = await getServerSession(req, res, authOptions);

//   // If the user is already logged in, redirect.
//   if (session && !hasRole(Roles.VoterEdit, session.user.roles)) {
//     res.writeHead(302, { Location: '/404' }).end();
//     return {};
//     // return { redirect: { destination: '/404' } };
//   }
//   return {};
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   // If the user is already logged in, redirect.
//   if (session && !hasRole(Roles.VoterEdit, session.user.roles)) {
//     context.res.writeHead(302, { Location: '/404' }).end();
//     return { props: {} };
//     // return { redirect: { destination: '/404' } };
//   }
//   return { props: {} };
// }

export default Index;
