import { FunctionComponent } from 'react';
import { EuiBreadcrumb } from '@elastic/eui';
import MainLayout from '@layouts/main';
import PagePlaceholder from '@components/page-placeholder';
import { useRouter } from 'next/router';

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
      text: 'Generate Sheets',
    },
  ];

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      <PagePlaceholder />
    </MainLayout>
  );
};

export default Index;
