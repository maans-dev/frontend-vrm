import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import VoterSearch from '@components/voter-search';
import router from 'next/router';

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
      text: 'Membership',
    },
    {
      text: 'Voter search',
    },
  ];

  return <VoterSearch breadcrumb={breadcrumb} />;
};

export default Index;
