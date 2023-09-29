import { FunctionComponent, useEffect, useState } from 'react';
import { EuiBreadcrumb, EuiCallOut } from '@elastic/eui';
import MainLayout from '@layouts/main';
import router from 'next/router';
import Head from 'next/head';
import CommsApproval from '@components/comms/comms-approval';
import useBulkCommsFetcher from '@lib/fetcher/comms/bulk-comms';
import useBulkCommsApprovalFetcher from '@lib/fetcher/comms-approval/comms-approval';
import { BulkComms } from '@lib/domain/bulk-comms';

const Index: FunctionComponent = () => {
  // const { generatedBulkCommsData, isLoading, error } = useBulkCommsFetcher();
  const [selectedTabId, setSelectedTabId] = useState('pending');
  const { bulkCommsApprovalData, mutate } =
    useBulkCommsApprovalFetcher(selectedTabId);
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
      text: 'Bulk Comms Approval',
    },
  ];

  const [bulkComms, setBulkComms] = useState<BulkComms[]>(
    bulkCommsApprovalData
  );

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
  };

  useEffect(() => {
    console.log({ bulkCommsApprovalData, mutate });
    if (bulkCommsApprovalData) setBulkComms(bulkCommsApprovalData);
  }, [bulkCommsApprovalData, mutate]);

  return (
    <>
      <Head>
        <title>VRM | Bulk Comms Approval </title>
      </Head>
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <CommsApproval
          bulkCommsApprovalData={bulkComms}
          selectedTabId={selectedTabId}
          onSelectedTabChanged={onSelectedTabChanged}
          mutate={mutate}
        />
      </MainLayout>
    </>
  );
};

export default Index;
