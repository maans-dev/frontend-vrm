import { Person } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function usePersonFetcher(key: string) {
  const shouldFetch = key ? true : false;

  const { data, error, isLoading, mutate, isValidating } = useSWR<Person[]>(
    shouldFetch
      ? `/person?key=${key}&template=["Address","Contact","Fields","Comment","Canvass","Membership"]`
      : null,
    fetcherAPI,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    person: data?.[0],
    isLoading,
    error: error,
    mutate,
    isValidating,
  };
}
