import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import MainLayout from '@layouts/main';
import PagePlaceholder from '@components/page-placeholder';

const Index: FunctionComponent = () => {
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Membership',
    },
  ];

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      <PagePlaceholder />
    </MainLayout>
  );
};

export default Index;
