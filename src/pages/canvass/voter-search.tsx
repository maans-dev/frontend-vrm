import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import VoterSearch from '@components/voter-search';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
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

  return <VoterSearch breadcrumb={breadcrumb} />;
};

export default Index;
