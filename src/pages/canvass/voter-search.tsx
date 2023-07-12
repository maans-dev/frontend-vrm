import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import { useRouter } from 'next/router';
import VoterSearch from '@components/voter-search';
import Head from 'next/head';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Home',
      href: '/',
      onClick: e => {
        router.push('/');
        e.preventDefault();
      },
    },
    {
      text: 'Canvass',
      href: '/canvassing-type',
      onClick: e => {
        router.push('/canvass/canvassing-type');
        e.preventDefault();
      },
    },
    {
      text: 'Voter search',
    },
  ];

  return (
    <>
      <Head>
        <title>VRM | Canvass | Voter Search </title>
      </Head>
      <VoterSearch breadcrumb={breadcrumb} />
    </>
  );
};

export default Index;
