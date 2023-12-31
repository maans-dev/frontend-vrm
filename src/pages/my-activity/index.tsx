import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import PersonHistory from '@components/person-history';
import { useSession } from 'next-auth/react';
import ActivityReportTable from '@components/activity-report';
import useActivityReportFetcher from '@lib/fetcher/activity/activity-report';
import Spinner from '@components/spinner/spinner';
import router from 'next/router';
import Head from 'next/head';

export const renderErrorCallout = error => {
  if (error?.cause?.cause?.status === 403) {
    return (
      <EuiCallOut
        color="primary"
        iconType="alert"
        title="You don't have permission to view activity of this user.">
        <EuiButton
          fill
          onClick={() => router.push('/activity-reports/voter-search')}>
          Return to voter search
        </EuiButton>
      </EuiCallOut>
    );
  }

  return (
    <EuiCallOut color="danger" iconType="alert" title="Error">
      {error.message}
    </EuiCallOut>
  );
};

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
      text: 'My Activity',
    },
  ];
  const { data: session } = useSession();
  const {
    activityReport,
    error: reportError,
    isLoading,
  } = useActivityReportFetcher(session?.user?.darn);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>VRM | My Activity </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          showSpinner={true}
          panelled={false}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>VRM | My Activity </title>
      </Head>
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        restrictWidth="1400px">
        {isLoading ? (
          <Spinner show={isLoading} />
        ) : (
          <>
            {activityReport && reportError && renderErrorCallout(reportError)}
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <EuiCallOut
                  color="primary"
                  title="This report shows a simple count of all of your activity
                recorded on VRM."
                  iconType="iInCircle"
                  size="s">
                  <EuiText size="xs">
                    The figures may be different from those on specific campaign
                    reports which apply particular criteria.
                  </EuiText>
                </EuiCallOut>
              </EuiFlexItem>
              <EuiFormFieldset legend={{ children: 'My Activity Report' }}>
                <ActivityReportTable report={activityReport} />
              </EuiFormFieldset>
              <EuiFormFieldset legend={{ children: 'My Activity' }}>
                <PersonHistory
                  personKey={session?.user?.darn}
                  mode="activity"
                />
              </EuiFormFieldset>
            </EuiFlexGroup>
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Index;
