import { Campaign } from '@lib/domain/person';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function useCampaignBulkCommsFetcher() {
  const { data, error, isLoading } = useSWR<Campaign[]>(
    '/activity/campaign/bulk-comms',
    fetcherAPI
  );

  return {
    campaignType: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
