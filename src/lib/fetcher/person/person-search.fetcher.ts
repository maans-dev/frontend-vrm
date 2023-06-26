/* eslint-disable prettier/prettier */
import { Person } from '@lib/domain/person';
import { PersonSearchParams } from '@lib/domain/person-search';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

interface PersonSearchResponse {
  count: number,
  values: Person[],
}

export default function usePersonSearchFetcher(
  params: Partial<PersonSearchParams>,
  limit = 10,
  offset = 0,
) {
  const shouldFetch = params ? true : false;
  // handle phone and email params
  let contactibility = null;
  if (shouldFetch) {
    if (params.phone || params.email) {
      contactibility = {}
      if (params.phone) {
        contactibility['PHONE'] = { value: params.phone }
        delete params.phone;
      }
      if (params.email) {
        contactibility['EMAIL'] = { value: params.email }
        delete params.email;
      }

      params.contactability = JSON.stringify(contactibility);
    }
  }

  const url = `/person?count=true&limit=${limit}&offset=${offset}&template=["Address","IEC","Contact"]&orderBy={"ignoreDefault":true,"values":[{"key":"surname","metaData":{"direction":"ASC"}},{"key":"firstName"}]}&${new URLSearchParams(
    params as never).toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PersonSearchResponse>(
    shouldFetch
      ? url
      : null,
    fetcherAPI,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
  );

  let wrappedError = null;
  if (error) {
    wrappedError = new Error(`Voter search failed: ${error.message}`, {cause: error});
  }

  return {
    results: data?.values,
    count: data?.count,
    isLoading,
    error: wrappedError,
    mutate
  };
}
