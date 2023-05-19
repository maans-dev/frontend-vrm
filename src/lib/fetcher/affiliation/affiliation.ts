import { Affiliation } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useAffiliationFetcher() {
  const endpoint = '/politicalparty';
  const { data, error, isLoading } = useSWR<Affiliation[]>(
    endpoint,
    fetcherAPI
  );

  return {
    affiliations: data || [],
    isLoading: isLoading && !error && !data,
    error,
  };
}
