/* eslint-disable prettier/prettier */
import { Person } from '@lib/domain/person';
import { PersonSearchParams } from '@lib/domain/person-search';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function usePersonSearchFetcher(
  params: Partial<PersonSearchParams>
) {
  const shouldFetch = params ? true : false;

  const { data, error, isLoading } = useSWR<Person[]>(
    shouldFetch
      ? `/person?template=["Address", "IEC"]&${new URLSearchParams(
        params as never
      ).toString()}`
      : null,
    fetcherAPI
  );

  return {
    results: data,
    isLoading,
    error: error,
  };
}
