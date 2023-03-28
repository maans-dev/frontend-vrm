import { FieldMetaData } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useTagFetcher(searchTerm: string) {
  const query = new URLSearchParams();
  if (searchTerm) {
    query.set('names', `*${searchTerm}*`);
    // query.set('code', `*${searchTerm}*`);
  }
  const endpoint = `/field/tag?${query.toString()}`;
  const { data, error } = useSWR<FieldMetaData[]>(
    searchTerm ? endpoint : null,
    fetcherAPI,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
