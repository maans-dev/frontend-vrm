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
  const clonedParams = {...params}
  let contactibility = null;
  if (shouldFetch) {
    if (clonedParams.phone || clonedParams.email) {
      contactibility = {}
      if (clonedParams.phone) {
        contactibility['PHONE'] = { value: clonedParams.phone }
        delete clonedParams.phone;
      }
      if (clonedParams.email) {
        contactibility['EMAIL'] = { value: clonedParams.email }
        delete clonedParams.email;
      }

      clonedParams.contactability = JSON.stringify(contactibility);
    }
  }

  if ('eligible' in clonedParams && clonedParams?.identity) {
    // don't send through eligible if identity search
    delete clonedParams.eligible;
  }

  const url = `/person?count=true&limit=${limit}&offset=${offset}&template=["Address","IEC","Contact"]&orderBy={"ignoreDefault":true,"values":[{"key":"surname","metaData":{"direction":"ASC"}},{"key":"firstName"}]}&${new URLSearchParams(
    clonedParams as never).toString()}`;

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
