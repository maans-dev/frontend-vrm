import { Roles } from '@lib/domain/auth';

export const hasRole = (role: Roles | string, roles: string[]): boolean => {
  if (!roles) return false;
  if (roles.includes(Roles.SuperUser)) return true;
  return roles.includes(role);
};

export const fetchAndExtractRoles = async accessToken => {
  // default to empty list of roles
  const roles: string[] = [];

  let rolesQry = '';
  Object.values(Roles).forEach((role, i) => {
    // if (role === Roles.SuperUser) return; // Just for debugging
    rolesQry += `${i === 0 ? '' : '&'}roles=${role}`;
  });

  const structureResponse = await fetch(
    `${process.env.NEXT_PUBLIC_GEO_API_BASE}/accessible-geographies/multiple-roles?${rolesQry}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!structureResponse.ok) {
    const msg = await structureResponse.text();
    // console.log(`[STRUCTURES ERROR]`, msg);
    throw msg;
  }

  const struct = await structureResponse.json();
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
};
