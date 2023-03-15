import fetch from 'isomorphic-unfetch';

export const fetcherAPI = (route: string) =>
  fetch(`https://sturdy-giggle.da-io.net${route}`).then(r => {
    return r.json();
  });
