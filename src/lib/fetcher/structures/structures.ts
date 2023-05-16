import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { Structure } from '@lib/domain/stuctures';

export default function useStructureFetcher(searchTerm: string) {
  const query = new URLSearchParams();
  if (searchTerm) {
    query.set('name', searchTerm);
  }
  const endpoint = `/structures/search?${query.toString()}`;
  const { data, error, isLoading } = useSWR<Structure[]>(
    searchTerm && searchTerm.length > 2 ? endpoint : null,
    fetcherAPI
  );

  return {
    structures: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
