import { DaAuthProvider } from '@lib/auth/da-provider';
import NextAuth, { TokenSet } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { fetchAndExtractRoles } from '@lib/auth/utils';
import { OAuthConfig } from 'next-auth/providers';
import { appsignal } from '@lib/appsignal';
import moment from 'moment';
import { Strategy, unleashClient } from '@lib/feature-toggles/unleash';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  console.log('[REFRESHING ACCESS TOKEN]', new Date());
  appsignal.addBreadcrumb({
    category: 'Log',
    action: 'REFRESHING ACCESS TOKEN',
  });
  const url = (DaAuthProvider as OAuthConfig<any>).token as string;
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.DA_ID,
    client_secret: process.env.DA_SECRET,
    refresh_token: `${token.refreshToken}`,
  });

  try {
    const response = await fetch(url, {
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw await response.clone().text();
    }

    const tokens: TokenSet = await response.clone().json();
    // console.log('[TOKENS]', tokens);

    console.log(
      '[REFRESHED ACCESS TOKEN]',
      tokens,
      moment.unix(Math.floor(Date.now() / 1000 + (tokens.expires_in as number)))
    );
    appsignal.addBreadcrumb({
      category: 'Log',
      action: 'REFRESHED ACCESS TOKEN',
    });
    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Math.floor(
        Date.now() / 1000 + (tokens.expires_in as number)
      ),
      refreshToken: tokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log('[RefreshAccessTokenError]', error);

    appsignal.sendError(
      new Error(`Unable to refresh access token: ${error?.message || error}`),
      span => {
        span.setAction('auth:refresh_token');
        span.setParams({
          route: url,
          error: JSON.stringify(error),
        });
        // span.setTags({ user_darn: session.user.darn.toString() }); // TODO: we probaly need the user darn here
      }
    );

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [DaAuthProvider],
  pages: {
    signIn: '/auth/signin',
  },
  // debug: true,
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (token?.error) delete token.error;
      if (trigger === 'update' && session?.disclosureAccepted) {
        token.disclosureAccepted = session.disclosureAccepted;
      }
      if (account && user && profile && user?.user?.darn_number) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.id = user.id;
        token.darn = user.user.darn_number;
        token.givenName = user.user.givenname_text
          ? user.user.givenname_text
          : user.user.firstname_text;
        token.surname = user.user.surname_text;
        token.dob = user.user.dob_number;
        token.roles = profile.roles;
        // console.log('jwt', { token, account });
      }

      return token;
    },
    async session({ session, token, user }) {
      // console.log('session', { session, token });
      if (token) {
        session.user.idNumber = token.id as string;
        session.user.darn = token.darn as number;
        session.user.givenName = token.givenName as string;
        session.user.surname = token.surname as string;
        session.user.dob = token.dob as number;
        session.user.roles = token.roles as string[];
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
        session.disclosureAccepted = token.disclosureAccepted as boolean;
        delete session.user.image;
        // console.log('session', { session, token, user });
        try {
          session.user.roles = await fetchAndExtractRoles(
            `${session.accessToken}`,
            session.user.darn,
            3
          );
        } catch (e) {
          throw e;
        }
        // get feature toggles definitions
        const toggles = unleashClient.getFeatureToggleDefinitions();
        // check if user id has permission fo feature
        const isUserEnabledForFeature = (
          feature: {
            name: string;
            description?: string;
            enabled: boolean;
            strategies?: Strategy[];
          },
          sessionUserDarn: string
        ) => {
          const strategyWithUserId = feature?.strategies?.find(
            strategy => strategy?.name === 'userWithId'
          );

          // If the feature is not enabled, return false.
          if (!feature.enabled) {
            return false;
          }

          if (!strategyWithUserId) {
            // If the feature doesn't have the 'userWithId' strategy,
            // then check if it is simply enabled.
            return true;
          }

          // Check if sessionUserDarn is defined and non-empty.
          if (!sessionUserDarn) {
            return false;
          }

          // Get the userIds parameter from the strategy and convert it to an array.
          const userIds = strategyWithUserId.parameters?.userIds
            ? strategyWithUserId.parameters.userIds
                .split(',')
                .map(userId => userId.trim())
            : [];

          // Check if the sessionUserDarn is in the array of userIds.
          return userIds.includes(sessionUserDarn);
        };

        session.features = toggles
          .filter(item =>
            isUserEnabledForFeature(item, session?.user?.darn?.toString())
          )
          .filter(i => i.enabled)
          .map(item => {
            if (item.name === 'maintenance-mode') {
              session.maintenanceMessage = item.description;
            }
            return item.name;
          });
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // allow redirect to DA SSO logout page for federated signout
      if (url === 'https://login.voteda.org/logout') return url;
      if (url.startsWith('/')) return `${url}`;
      return baseUrl;
    },
  },
};
export default NextAuth(authOptions);
