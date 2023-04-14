import { Affiliation } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useAffiliationFetcher(searchTerm: string) {
  const query = new URLSearchParams();
  if (searchTerm) {
    query.set('name', `*${searchTerm}*`);
  }
  const endpoint = `/politicalparty?${query.toString()}`;
  const { data, error, isLoading } = useSWR<Affiliation[]>(
    searchTerm ? endpoint : null,
    fetcherAPI
  );

  return {
    affiliations: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
