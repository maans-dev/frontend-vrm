import { appsignal } from '@lib/appsignal';
import { getSession } from 'next-auth/react';

const fetchInnards = async (route: string) => {
  const session = await getSession();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      appsignal.sendError(
        new Error(`Auth error - ${res.status}`),
        async span => {
          span.setAction('auth-error');
          span.setParams({
            route: route,
            status: res.status,
            info: await res.clone().text(),
          });
        }
      );
    }
    let errorMessage: any;
    try {
      errorMessage = await res.clone().json();
    } catch {}

    if (!errorMessage) errorMessage = await res.clone().text();
    appsignal.sendError(
      new Error(
        `Auth error - ${errorMessage?.message ?? errorMessage} - ${res.status}`
      ),
      async span => {
        span.setAction('auth-error');
        span.setParams({
          route: route,
          status: res.status,
          info: errorMessage,
        });
      }
    );
  }

  return res;
};

export const fetcherAPI = async (route: string) => {
  try {
    const res = await fetchInnards(route);
    return await res.clone().json();
  } catch (e) {
    appsignal.sendError(
      new Error(`An error occurred while fetching data: ${e.message}`),
      span => {
        span.setAction('api-call');
        span.setParams({
          route: route,
        });
      }
    );
  }
};

export const fetcherFile = async (key: string) => {
  try {
    const res = await fetchInnards(`/file?key=${key}`);

    const blob = await res.clone().blob();
    const contentType = res.headers.get('content-type');
    const contentDisposition = res.headers.get('content-disposition');
    const fileNameMatch = /filename="([^"]*)"/.exec(contentDisposition);
    const fileName = fileNameMatch != null ? fileNameMatch[1] : undefined;

    return {
      fileName,
      contentType,
      blob,
    };
  } catch (e) {
    appsignal.sendError(
      new Error(`An error occurred while fetching data: ${e.message}`),
      span => {
        span.setAction(`api-call:/file?key=${key}`);
        span.setParams({});
      }
    );
  }
};
