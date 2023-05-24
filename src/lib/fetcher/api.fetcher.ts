import { appsignal } from '@lib/appsignal';
import { getSession } from 'next-auth/react';

export const fetcherAPI = async (route: string) => {
  const session = await getSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    const error = new Error(
      `An error occurred while fetching the data. (${errorText} - ${res.status})`
    );
    if (error) {
      appsignal.sendError(error, span => {
        span.setAction('api-fetcher');
        span.setParams({ route, user: session.user.darn });
        span.setTags({ user_darn: session.user.darn.toString() });
      });
    }
    throw error;
  }

  return await res.json();
};
