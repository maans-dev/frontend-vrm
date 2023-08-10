import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { PersonHistoryResponse } from '@lib/domain/person-history';

export default function usePersonHistoryOrActivityFetcher(
  key: number,
  startDate: string,
  endDate: string,
  limit: number,
  offset: number,
  mode: 'history' | 'activity' = 'history'
) {
  const shouldFetch = key ? true : false;

  let endpoint;

  if (mode === 'history') {
    endpoint = `/person/${key}/event/history?count=true&limit=${limit}&offset=${offset}&template=ARCHIVE`;
  } else {
    endpoint = `/person/${key}/event/activity?count=true&limit=${limit}&offset=${offset}&template=ARCHIVE`;
  }

  const { data, error, isLoading, mutate } = useSWR<PersonHistoryResponse>(
    shouldFetch ? endpoint : null,
    fetcherAPI
    // {
    //   revalidateIfStale: true,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // }
  );

  return {
    history: data,
    isLoading,
    error,
    mutate,
  };
}
