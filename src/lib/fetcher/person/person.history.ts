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

  const endpoint =
    mode === 'history'
      ? `/person/${key}/event/history?count=true&limit=${limit}&offset=${offset}&timePeriod={"from":"${startDate}","to":"${endDate}"}`
      : `/person/${key}/event/activity?count=true&limit=${limit}&offset=${offset}`;

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
