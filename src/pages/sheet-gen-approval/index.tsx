import { FunctionComponent, useEffect, useState } from 'react';
import { EuiBreadcrumb, EuiCallOut, EuiEmptyPrompt } from '@elastic/eui';
import MainLayout from '@layouts/main';
import router from 'next/router';
import SheetApproval from '@components/sheets-approval';
import useSheetFetcher from '@lib/fetcher/sheet-gen-approval/pending-sheets';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { appsignal } from '@lib/appsignal';

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
      text: 'Sheet Generation Approval',
    },
  ];
  const {
    sheetData,
    error: sheetFetchError,
    isLoading: sheetFetchIsLoading,
    isValidating,
  } = useSheetFetcher();
  const { data: session } = useSession();
  const [approvedSheets, setApprovedSheet] = useState([]);
  const [rejectedSheets, setRejectedSheet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const getApprovedSheets = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/approved/extract/sheet`;
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
    setApprovedSheet(data);
    setIsLoading(false);
  };

  const getRejectedSheets = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/rejected/extract/sheet`;
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
    setRejectedSheet(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getApprovedSheets();
    getRejectedSheets();
  }, []);

  if (isLoading || sheetFetchIsLoading || isValidating) {
    return (
      <>
        <Head>
          <title>VRM | Sheet Generation Approval </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          showSpinner={isLoading || isValidating}
          panelled={false}
        />
      </>
    );
  }

  if (error || sheetFetchError) {
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

  return (
    <>
      <Head>
        <title>VRM | Sheet Generation Approval </title>
      </Head>
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <SheetApproval
          sheetData={sheetData}
          approvedSheets={approvedSheets}
          rejectedSheets={rejectedSheets}
        />
      </MainLayout>
    </>
  );
};

export default Index;
