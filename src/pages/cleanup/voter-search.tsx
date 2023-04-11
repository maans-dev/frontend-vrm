import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import VoterSearch from '@components/voter-search';

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

export default Index;
