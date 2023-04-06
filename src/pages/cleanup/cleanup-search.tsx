import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import { useRouter } from 'next/router';
import VoterSearch from '@components/voter-search';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Data Cleanup',
      href: '/cleanup',
      onClick: e => {
        router.push('/');
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
