import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { Structure } from '@lib/domain/person';

export default function useStructureFetcher(
  searchTerm: string,
  addLimitAction: boolean
) {
  const query = new URLSearchParams();
  if (searchTerm) {
    query.set('name', searchTerm);
  }

  if (addLimitAction) {
    query.set('limitAction', 'sheetGen');
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
