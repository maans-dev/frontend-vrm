import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { BulkComms } from '@lib/domain/bulk-comms';
import { useState } from 'react';

export default function useBulkCommsApprovalFetcher(selectedTabId: string) {
  const endpointMap = {
    pending: '/activity/pending-my-approval/bulk-comms/',
    rejected: '/activity/rejected/bulk-comms/',
    approvedS: '/activity/approved-for-sending/bulk-comms/',
    approvedD: '/activity/approved-for-download/bulk-comms/',
  };

  const endpoint = endpointMap[selectedTabId];

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<BulkComms[]>(
    endpoint,
    fetcherAPI,
    { refreshInterval: 10000, revalidateOnFocus: true }
  );

  return {
    bulkCommsApprovalData: data,
    isLoading: isLoading && !error && !data,
    error,
    mutate,
    isRefreshing,
  };
}
