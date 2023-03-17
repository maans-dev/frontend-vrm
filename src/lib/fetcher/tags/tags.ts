import { PartyTags } from '@components/voter-tags/types';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useTagFetcher() {
  const { data, error } = useSWR<PartyTags[]>('/field/tag', fetcherAPI);

  return {
    data: data,
    isLoading: !error && !data,
    error,
  };
}
