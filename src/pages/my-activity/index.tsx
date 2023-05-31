import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
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
import useActivityFetcher from '@lib/fetcher/activity/my-activity';
import Spinner from '@components/spinner/spinner';
import router from 'next/router';

export const renderErrorCallout = error => {
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
  const {
    activityData,
    error: activityError,
    isLoading: activityLoading,
  } = useActivityFetcher(session?.user?.darn);

  if (isLoading || activityLoading) {
    return (
      <MainLayout breadcrumb={breadcrumb} showSpinner={true} panelled={false} />
    );
  }

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      {isLoading && activityLoading ? (
        <Spinner show={isLoading || activityLoading} />
      ) : (
        <>
          {activityReport && reportError && renderErrorCallout(reportError)}
          {activityData && activityError && renderErrorCallout(activityError)}
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
                myActivity={activityData}
              />
            </EuiFormFieldset>
          </EuiFlexGroup>
        </>
      )}
    </MainLayout>
  );
};

export default Index;
