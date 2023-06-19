import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { SheetGeneration } from '@lib/domain/sheet-generation';

export default function useSheetGenFetcher() {
  const endpoint = '/activity/extract/sheetgen';
  const { data, error, isLoading, mutate } = useSWR<SheetGeneration[]>(
    endpoint,
    fetcherAPI,
    { refreshInterval: 10000, revalidateOnFocus: true }
  );

  return {
    generatedSheetData: data,
    isLoading: isLoading && !error && !data,
    error,
    mutate,
  };
}
