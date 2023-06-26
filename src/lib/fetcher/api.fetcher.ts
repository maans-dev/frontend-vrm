import { getSession } from 'next-auth/react';

export const fetcherAPI = async (route: string) => {
  const session = await getSession();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        const error = new Error(`Auth error - ${res.status}`, {
          cause: {
            status: res.status,
            info: await res.clone().text(),
            route,
          } as any,
        });
        throw error;
      }

      let errorMessage: any;
      try {
        errorMessage = await res.clone().json();
      } catch {}

      if (!errorMessage) errorMessage = await res.clone().text();

      throw new Error(
        `${errorMessage?.message ?? errorMessage} - ${res.status}`,
        {
          cause: { status: res.status, info: errorMessage, route } as any,
        }
      );
    }

    return await res.clone().json();
  } catch (e) {
    const error = new Error(
      `An error occurred while fetching data: ${e.message}`,
      {
        cause: e,
      }
    );
    throw error;
  }
};
