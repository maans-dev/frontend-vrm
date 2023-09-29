import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { BulkComms } from '@lib/domain/bulk-comms';

export default function useBulkCommsFetcher() {
  const endpoint = '/activity/extract/bulk-comms';
  const { data, error, isLoading, mutate } = useSWR<BulkComms[]>(
    endpoint,
    fetcherAPI,
    { refreshInterval: 10000, revalidateOnFocus: true }
  );

  return {
    generatedBulkCommsData: data,
    isLoading: isLoading && !error && !data,
    error,
    mutate,
  };
}
