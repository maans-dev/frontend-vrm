import React, { FunctionComponent, useEffect, useState } from 'react';
import useSheetFetcher from '@lib/fetcher/sheet-gen-approval/pending-sheets';
import { useRouter } from 'next/router';
import MainLayout from '@layouts/main';
import { EuiBreadcrumb, EuiCallOut } from '@elastic/eui';
import SheetPageApproveCard from '@components/sheets-approval/sheet-approver-card';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { appsignal } from '@lib/appsignal';

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
      text: 'Sheet Generation Approval',
      onClick: e => {
        router.push('/sheet-gen-approval');
        e.preventDefault();
      },
    },
  ];
  const {
    sheetData,
    isLoading: sheetFetchIsLoading,
    error: sheetFetchError,
  } = useSheetFetcher();
  const router = useRouter();
  const { data: session } = useSession();
  const [uuid, setUuid] = useState<string>('');
  const [approvalStatus, setApprovalStatus] = useState<string | string[]>('');
  const [prevSheet, setPrevSheet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const getPrevSheets = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/approved-rejected/extract/sheet`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'GET',
    });
    if (!response.ok) {
      const errJson = await response.clone().json();
      setError(errJson);

      appsignal.sendError(
        new Error(`Unable to load approved rejected sheets: ${errJson}`),
        span => {
          span.setAction('api-call:/activity/approved-rejected/extract/sheet');
          span.setParams({
            route: url,
            user: session.user.darn,
          });
          span.setTags({ user_darn: session?.user?.darn?.toString() });
        }
      );
      return;
    }
    const data = await response.json();
    setPrevSheet(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getPrevSheets();
  }, []);

  useEffect(() => {
    const { uuid, status } = router.query;
    if (typeof uuid === 'string' && status) {
      setUuid(uuid);
      setApprovalStatus(status);
    }
    if (prevSheet?.length > 1 && uuid && approvalStatus) {
      const filteredPrevSheet = prevSheet.filter(item => item.key === uuid);
      setPrevSheet(filteredPrevSheet);
    }
  }, [sheetData, prevSheet, uuid]);

  if (sheetFetchIsLoading) {
    return (
      <>
        <Head>
          <title>VRM | Sheet Generation Approval </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          showSpinner={sheetFetchIsLoading}
          panelled={false}
        />
      </>
    );
  }

  if (sheetFetchError || error) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        showSpinner={isLoading}>
        {error && (
          <EuiCallOut
            title="Sheet Generation Error"
            color="danger"
            iconType="alert">
            {error}
          </EuiCallOut>
        )}
        {sheetFetchError && (
          <EuiCallOut
            title="Sheet Generation Error"
            color="danger"
            iconType="alert">
            {sheetFetchError.message}
          </EuiCallOut>
        )}
      </MainLayout>
    );
  }

  if (
    (uuid.toString() === prevSheet[0]?.key &&
      prevSheet[0]?.status === 'DONE') ||
    prevSheet[0]?.status === 'REJECTED'
  ) {
    return (
      <>
        <Head>
          <title>VRM | Sheet Generation Approval </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          panelled={false}
          showSpinner={isLoading}>
          {Array.isArray(prevSheet) &&
            prevSheet?.map(item => {
              if (item.key === uuid) {
                return (
                  <SheetPageApproveCard
                    key={item.key}
                    data={item}
                    approvalStatus={approvalStatus}
                    activityUUID={uuid}
                  />
                );
              }
              return null;
            })}
        </MainLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>VRM | Sheet Generation Approval </title>
      </Head>
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <>
          {Array.isArray(sheetData) &&
            sheetData?.map(item => {
              if (item.key === uuid) {
                return (
                  <SheetPageApproveCard
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
