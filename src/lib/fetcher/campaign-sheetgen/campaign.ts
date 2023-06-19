import { Campaign } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useCampaignSheetGenFetcher() {
  const { data, error, isLoading } = useSWR<Campaign[]>(
    '/activity/campaign/sheetgen',
    fetcherAPI
  );

  return {
    campaignType: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
