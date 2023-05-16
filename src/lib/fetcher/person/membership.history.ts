import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { PersonHistoryResponse } from '@lib/domain/person-history';

export default function useMembershipHistoryFetcher(
  key: number,
  startDate: string,
  endDate: string,
  limit: number,
  offset: number
) {
  const shouldFetch = key ? true : false;

  const { data, error, isLoading, mutate } = useSWR<PersonHistoryResponse>(
    shouldFetch
      ? `/person/${key}/event/membership?count=true&limit=${limit}&offset=${offset}&timePeriod={"from":"${startDate}","to":"${endDate}"}`
      : null,
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
