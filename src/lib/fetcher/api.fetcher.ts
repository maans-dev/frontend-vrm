import fetch from 'isomorphic-unfetch';

export const fetcherAPI = (route: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`).then(r => {
    return r.json();
  });
