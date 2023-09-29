import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  EuiBreadcrumb,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingChart,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import router from 'next/router';
import GenerateBulkComms from '@components/comms/gen-comms';
import useCampaignBulkCommsFetcher from '@lib/fetcher/campaign-comms/campaign';

const GenComms: FunctionComponent = () => {
  const [mode, setMode] = useState('');

  const { request } = router.query;
  const {
    campaignType,
    isLoading: campaignTypeLoading,
    error: campaignTypeError,
  } = useCampaignBulkCommsFetcher();

  useEffect(() => {
    setMode(request === 'email' ? 'email' : request === 'sms' ? 'sms' : '');
  }, [request]);

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
      text: 'Bulk Comms',
      onClick: e => {
        router.push('/comms');
        e.preventDefault();
      },
    },
    {
      text: mode === 'email' ? 'Request an email' : 'Request an SMS',
    },
  ];

  if (campaignTypeLoading) {
    return (
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiLoadingChart mono size="xl" />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      {campaignTypeError && (
        <EuiCallOut title="Campaign Type Error" color="danger" iconType="alert">
          {campaignTypeError.message}
        </EuiCallOut>
      )}
      <GenerateBulkComms mode={mode} bulkCommsCampaignType={campaignType} />
    </MainLayout>
  );
};

export default GenComms;
