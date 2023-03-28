import { FieldMetaData } from '@lib/domain/person';
import { CanvassingTagCodes } from '@lib/domain/tags';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useCanvassingTagFetcher() {
  const query = new URLSearchParams();

  query.set('code', JSON.stringify(CanvassingTagCodes));

  const endpoint = `/field/tag?${query.toString()}`;
  const { data, error, isLoading } = useSWR<FieldMetaData[]>(
    endpoint,
    fetcherAPI,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}
