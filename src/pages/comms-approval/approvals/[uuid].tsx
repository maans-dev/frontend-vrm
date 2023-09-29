import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@layouts/main';
import { EuiBreadcrumb, EuiCallOut } from '@elastic/eui';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import CommsPageApproveCard from '@components/comms/comms-approval/comms-approver-card';
import useBulkCommsApprovalFetcher from '@lib/fetcher/comms-approval/comms-approval';

const SheetApproval: FunctionComponent = () => {
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
      onClick: e => {
        router.push('/comms-approval');
        e.preventDefault();
      },
    },
  ];
  // const { generatedBulkCommsData, isLoading, error } = useBulkCommsFetcher();

  const { bulkCommsApprovalData } = useBulkCommsApprovalFetcher('pending');
  const router = useRouter();
  const { data: session } = useSession();
  const [uuid, setUuid] = useState<string>('');
  const [approvalStatus, setApprovalStatus] = useState<string | string[]>('');
  const [prevComms, setPrevComms] = useState([]);

  useEffect(() => {
    const { uuid, status } = router.query;
    if (typeof uuid === 'string' && status) {
      setUuid(uuid);
      setApprovalStatus(status);
    }
  }, [router.query, uuid]);

  return (
    <>
      <Head>
        <title>VRM | Bulk Comms Approval </title>
      </Head>
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <>
          {true &&
            bulkCommsApprovalData?.map(item => {
              if (item.key === uuid) {
                return (
                  <CommsPageApproveCard
                    key={item.key}
                    data={item}
                    approvalStatus={approvalStatus}
                    activityUUID={uuid}
                  />
                );
              }
              return null;
            })}
        </>
      </MainLayout>
    </>
  );
};

export default SheetApproval;
