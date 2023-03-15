import { Affiliation } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useAffiliationFetcher() {
  const { data, error } = useSWR<Affiliation[]>('/politicalparty', fetcherAPI);

  return {
    affiliations: data,
    isLoading: !error && !data,
    error,
  };
}
