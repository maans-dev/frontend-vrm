import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { PersonHistoryResponse } from '@lib/domain/person-history';

export default function useActivityFetcher(darnNumber: number) {
  const endpoint = `/person/${darnNumber}/event/activity?limit=10&offset=1&count=true`;
  const { data, error, isLoading } = useSWR<PersonHistoryResponse>(
    endpoint,
    fetcherAPI
  );

  return {
    activityData: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
