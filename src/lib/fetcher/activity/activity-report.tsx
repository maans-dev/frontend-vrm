import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { MyActivityReport } from '@lib/domain/person-history';

export default function useActivityReportFetcher(darnNumber: number) {
  const endpoint = `/person/${darnNumber}/activity/report`;
  const { data, error, isLoading } = useSWR<MyActivityReport[]>(
    endpoint,
    fetcherAPI
  );

  return {
    activityReport: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
