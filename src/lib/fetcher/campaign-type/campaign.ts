import { Campaign } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useCanvassTypeFetcher() {
  const { data, error, isLoading } = useSWR<Campaign[]>(
    '/activity/campaign/',
    fetcherAPI
  );

  return {
    campaignType: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
