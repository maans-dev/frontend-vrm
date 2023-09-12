import { appsignal } from '@lib/appsignal';
import { hasRole } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { Person } from '@lib/domain/person';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcherAPI } from '../api.fetcher';

export default function usePersonFetcher(
  key: string,
  isMembershipRequest = false
) {
  const shouldFetch = key ? true : false;
  const { data: session } = useSession();

  const hasMembershipAdminRole = hasRole(
    Roles.MembershipAdmin,
    session?.user?.roles
  );

  const hasMembershipRole = hasRole(Roles.Membership, session?.user?.roles);

  const membershipTemplate =
    isMembershipRequest && (hasMembershipAdminRole || hasMembershipRole)
      ? 'Membership'
      : 'Membership_Ltd';

  const url = `/person?key=${key}&template=["Address","IEC","Contact","Fields","Comment","Canvass","${membershipTemplate}"]`;

  const { data, error, isLoading, mutate, isValidating } = useSWR<Person[]>(
    shouldFetch ? url : null,
    fetcherAPI,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  let emptyError;
  if (!data?.length && !error) {
    emptyError = new Error(`A voter with DARN "${key}" does not exist`);
  }

  let wrappedError = null;
  if (error) {
    wrappedError = new Error(`Unable to load voter: ${error.message}`);
    if (error) {
      appsignal.sendError(wrappedError, span => {
        span.setAction('api:/person');
        span.setParams({
          params: JSON.stringify({ key }),
          route: url,
        });
        span.setTags({
          user_darn: session?.user?.darn?.toString(),
          route: '/person',
        });
      });
    }
  }

  return {
    person: data?.[0],
    isLoading,
    error: error || emptyError,
    mutate,
    isValidating,
  };
}
