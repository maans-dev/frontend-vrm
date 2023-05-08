import { getSession } from 'next-auth/react';

export const fetcherAPI = async (route: string) => {
  const session = await getSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.json();
    const error = new Error(
      `An error occurred while fetching the data. (${errorText.status} - ${errorText.message})`
    );
    throw error;
  }

  return await res.json();
};
