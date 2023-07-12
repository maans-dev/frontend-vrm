import { FunctionComponent } from 'react';
import { EuiBreadcrumb, EuiFlexGroup, EuiFormFieldset } from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import PersonHistory from '@components/person-history';
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';
import ActivityReportTable from '@components/activity-report';
import useActivityReportFetcher from '@lib/fetcher/activity/activity-report';
import Spinner from '@components/spinner/spinner';
import { renderErrorCallout } from 'pages/my-activity';
import { renderName } from '@lib/person/utils';
import Head from 'next/head';

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
      text: 'Voter search',
      href: '/voter-search',
      onClick: e => {
        router.push('/activity-reports/voter-search');
        e.preventDefault();
      },
    },
    {
      text: 'Activity Reports',
    },
  ];
  const router = useRouter();
  const voterKey = router?.query?.voterKey as string;

  const { person, isLoading: personLoading } = usePersonFetcher(voterKey);
  const {
    activityReport,
    error: reportError,
    isLoading,
  } = useActivityReportFetcher(Number(voterKey));

  if (isLoading || !voterKey) {
    return (
      <>
        <Head>
          <title>VRM | Activity Reports | Voter </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          showSpinner={isLoading}
          panelled={false}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>VRM | Activity Reports | Voter </title>
      </Head>
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        restrictWidth="1400px">
        {isLoading && personLoading ? (
          <Spinner show={isLoading} />
        ) : (
          <>
            {reportError ? (
              renderErrorCallout(reportError)
            ) : (
              <EuiFlexGroup direction="column">
                <EuiFormFieldset
                  legend={{
                    children: `Activity Report for ${
                      person && renderName(person)
                    }`,
                  }}>
                  <ActivityReportTable report={activityReport} />
                </EuiFormFieldset>
                <EuiFormFieldset
                  legend={{
                    children: `History for ${person && renderName(person)}`,
                  }}>
                  <PersonHistory personKey={Number(voterKey)} mode="activity" />
                </EuiFormFieldset>
              </EuiFlexGroup>
            )}
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Index;
