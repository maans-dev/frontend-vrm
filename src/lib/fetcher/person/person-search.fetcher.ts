/* eslint-disable prettier/prettier */
import { Person } from '@lib/domain/person';
import { PersonSearchParams } from '@lib/domain/person-search';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function usePersonSearchFetcher(
  params: Partial<PersonSearchParams>
) {
  const shouldFetch = params ? true : false;

  // handle phone and email params
  let contactibility = null;
  if (shouldFetch) {
    if (params.phone || params.email) {
      contactibility = {}
      if (params.phone) {
        contactibility['PHONE'] = { canContact: true, value: params.phone }
        delete params.phone;
      }
      if (params.email) {
        contactibility['EMAIL'] = { canContact: true, value: params.email }
        delete params.email;
      }

      params.contactability = JSON.stringify(contactibility);
    }
  }

  const { data, error, isLoading, mutate } = useSWR<Person[]>(
    shouldFetch
      ? `/person?template=["Address","IEC","Contact"]&limit=10&${new URLSearchParams(
        params as never
      ).toString()}`
      : null,
    fetcherAPI,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
  );

  return {
    results: data,
    isLoading,
    error: error,
    mutate
  };
}
