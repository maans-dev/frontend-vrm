import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { Ward } from '@lib/domain/ward';

export default function useWardFetcher(code: string) {
  const query = new URLSearchParams();
  if (code) {
    query.set('code', code);
  }
  const endpoint = `/structures/wards/?${query.toString()}`;
  const { data, error, isLoading } = useSWR<Ward[]>(
    code ? endpoint : null,
    fetcherAPI
  );

  return {
    wards: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
