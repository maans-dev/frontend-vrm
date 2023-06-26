import { Provider } from 'next-auth/providers';
import { fetchAndExtractRoles } from './utils';

export const DaAuthProvider: Provider = {
  id: 'da',
  name: 'DA Single Sign On',
  type: 'oauth',
  authorization: {
    url: 'https://login.voteda.org/authorize',
    // @ts-ignore
    params: { scope: ['openid profile userinfo query-people-api-details'] }, // TODO: Scopes should not be an array, but for some reason auth fails when it's not!?
  },
  token: 'https://login.voteda.org/token',
  userinfo: {
    url: 'https://login.voteda.org/userinfo',
    async request({ tokens, provider }) {
      const userInfoResponse = await fetch(
        'https://login.voteda.org/userinfo',
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      const userInfo = await userInfoResponse.json();

      // console.log('[USER_INFO]', userInfo);

      userInfo.roles = await fetchAndExtractRoles(
        tokens.access_token,
        userInfo?.peopleApiDetails?.darn_number,
        3
      );
      return userInfo;
    },
  },
  clientId: process.env.DA_ID,
  clientSecret: process.env.DA_SECRET,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile?.peopleApiDetails?.givenname_text
        ? profile?.peopleApiDetails?.givenname_text
        : `${profile?.peopleApiDetails?.firstname_text} ${profile?.peopleApiDetails?.surname_text}`,
      email: profile?.email,
      user: profile?.peopleApiDetails,
    };
  },
};
