import { appsignal } from '@lib/appsignal';
import { getSession } from 'next-auth/react';

export const fetcherAPI = async (route: string) => {
  const session = await getSession();
  try {
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
          `Auth error - ${errorMessage?.message ?? errorMessage} - ${
            res.status
          }`
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
