import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useSheetFetcher() {
  const endpoint = `/activity/pending-my-approval/extract/sheet`;
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    endpoint,
    fetcherAPI,
    {
      refreshInterval: 8000,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  );

  return {
    sheetData: data,
    isLoading: isLoading && !error && !data,
    error,
    isValidating,
    mutate,
  };
}
