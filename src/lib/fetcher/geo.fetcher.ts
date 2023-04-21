import fetch from 'isomorphic-unfetch';

export const fetcherGeo = (route: string) =>
  fetch(`${process.env.NEXT_PUBLIC_GEO_API_BASE}${route}`).then(r => {
    return r.json();
  });
