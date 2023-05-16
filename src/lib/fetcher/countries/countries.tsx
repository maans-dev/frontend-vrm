import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { Country } from '@lib/domain/country';

export default function useCountryFetcher(searchTerm: string) {
  const query = new URLSearchParams();
  if (searchTerm) {
    if (searchTerm.length === 2) {
      query.set('code', searchTerm.toUpperCase());
    } else {
      query.set('name', searchTerm);
    }
  }
  const endpoint = `/structures/countries${
    searchTerm ? `?${query.toString()}` : ''
  }`;
  const { data, error, isLoading } = useSWR<Country[]>(
    searchTerm ? endpoint : null,
    fetcherAPI
  );

  return {
    countries: data,
    isLoading: isLoading && !error && !data,
    error,
  };
}
