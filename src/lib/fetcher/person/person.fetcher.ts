import { Person } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function usePersonFetcher(key: string) {
  const { data, error, isLoading } = useSWR<Person[]>(
    `/person?key=${key}&template=["Address","Contact","Field","Comment","Canvass"]`,
    fetcherAPI
  );

  return {
    person: data?.[0],
    isLoading,
    error: error,
  };
}
