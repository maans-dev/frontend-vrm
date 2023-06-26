import { appsignal } from '@lib/appsignal';
import { Roles } from '@lib/domain/auth';

export const hasRole = (
  role: Roles | string,
  roles: string[],
  explicit?: boolean
): boolean => {
  if (!roles) return false;
  if (!explicit && roles.includes(Roles.SuperUser)) return true;
  return roles.includes(role);
};

export const fetchAndExtractRoles = async (
  accessToken,
  darn_number: number,
  retries: number
) => {
  let url = '';
  try {
    // default to empty list of roles
    const roles: string[] = [];

    let rolesQry = '';
    Object.values(Roles).forEach((role, i) => {
      // if (role === Roles.SuperUser) return; // Just for debugging
      rolesQry += `${i === 0 ? '' : '&'}roles=${role}`;
    });

    url = `${process.env.NEXT_PUBLIC_GEO_API_BASE}/accessible-geographies/multiple-roles?${rolesQry}`;

    const structureResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!structureResponse.ok) {
      const msg = await structureResponse.clone().text();
      throw msg;
    }

    const struct = await structureResponse.clone().json();
    // console.log('[STRUCTURES]', struct);

    for (const role of Object.values(Roles)) {
      if (!(role in struct)) continue;
      for (const s in Object.values(struct[role])) {
        if (s.length > 0) {
          roles.push(role);
          break;
        }
      }
    }

    // console.log('[ROLES]', roles);
    return roles;
  } catch (e) {
    if (retries > 0) {
      await sleep(300);
      appsignal.addBreadcrumb({
        category: 'Log',
        action: 'FETCH AND EXTRACT ROLES',
        metadata: {
          attempt: retries,
          error: e,
        },
      });
      return fetchAndExtractRoles(accessToken, darn_number, retries - 1);
    }
    appsignal.sendError(
      new Error(`Auth Error:fetchAndExtractRoles: ${e}`),
      span => {
        span.setAction('auth:fetchAndExtractRoles');
        span.setParams({
          route: url,
          error: e,
        });
        span.setTags({ user_darn: darn_number?.toString() });
      }
    );
    throw e;
  }
};

const sleep = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay));
