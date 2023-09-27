import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';
import { PersonHistoryResponse } from '@lib/domain/person-history';
import { hasRole } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { useSession } from 'next-auth/react';

export default function usePersonHistoryOrActivityFetcher(
  key: number,
  startDate: string,
  endDate: string,
  limit: number,
  offset: number,
  mode: 'history' | 'activity'
) {
  const shouldFetch = key ? true : false;
  const { data: session } = useSession();
  const isAdmin = hasRole(Roles.SuperUser, session?.user?.roles);

  let endpoint;

  if (mode === 'history') {
    endpoint = `/person/${key}/event/history?count=true&limit=${limit}&offset=${offset}${
      isAdmin && '&template=ARCHIVE'
    }&timePeriod={"from":"${startDate}","to":"${endDate}"}`;
  } else {
    endpoint = `/person/${key}/event/activity?count=true&limit=${limit}&offset=${offset}${
      isAdmin && '&template=ARCHIVE'
    }&timePeriod={"from":"${startDate}","to":"${endDate}"}`;
  }

  const { data, error, isLoading, mutate } = useSWR<PersonHistoryResponse>(
    shouldFetch ? endpoint : null,
    fetcherAPI
  );

  return {
    history: data,
    isLoading,
    error,
    mutate,
  };
}
