import { FunctionComponent } from 'react';
import { EuiBreadcrumb, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import router from 'next/router';
import Head from 'next/head';
import MainLayout from '@layouts/main';
import { LiveMap, Legend } from '@components/live-map/map';

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
      text: 'Live Map',
    },
  ];

  return (
    <>
      <Head>
        <title>VRM | Live Map</title>
      </Head>
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        restrictWidth={false}>
        <EuiFlexGroup
          direction="column"
          css={{ height: '100%' }}
          gutterSize="m">
          <EuiFlexItem grow={false}>
            <Legend />
          </EuiFlexItem>
          <EuiFlexItem grow>
            <LiveMap />
          </EuiFlexItem>
        </EuiFlexGroup>
      </MainLayout>
    </>
  );
};

export default Index;
