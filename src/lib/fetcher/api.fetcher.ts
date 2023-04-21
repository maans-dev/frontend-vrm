import fetch from 'isomorphic-unfetch';
import { getSession } from 'next-auth/react';

export const fetcherAPI = async (route: string) => {
  const session = await getSession();
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  }).then(r => {
    return r.json();
  });
};
