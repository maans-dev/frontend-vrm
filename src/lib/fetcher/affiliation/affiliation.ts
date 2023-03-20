import { Affiliation } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useAffiliationFetcher(shouldFetch: boolean) {
  const { data, error, isLoading } = useSWR<Affiliation[]>(
    shouldFetch ? '/politicalparty' : null,
    fetcherAPI
  );

  return {
    affiliations: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
