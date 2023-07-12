import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import VoterSearch from '@components/voter-search';
import router from 'next/router';
import Head from 'next/head';

const Index: FunctionComponent = () => {
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
      text: 'Data Cleanup',
    },
    {
      text: 'Voter search',
    },
  ];

  return (
    <>
      <Head>
        <title>VRM | Data Cleanup | Voter Search </title>
      </Head>
      <VoterSearch breadcrumb={breadcrumb} />
    </>
  );
};

export default Index;
