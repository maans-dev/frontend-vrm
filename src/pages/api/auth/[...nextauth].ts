import { DaAuthProvider } from '@lib/auth/da-provider';
import NextAuth, { TokenSet } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { fetchAndExtractRoles } from '@lib/auth/utils';
import { OAuthConfig } from 'next-auth/providers';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  console.log('[REFRESHING ACCESS TOKEN]', new Date());
  try {
    const url = (DaAuthProvider as OAuthConfig<any>).token as string;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.DA_ID,
      client_secret: process.env.DA_SECRET,
      refresh_token: token.refreshToken,
    });

    const response = await fetch(url, {
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw await response.text();
    }

    const tokens: TokenSet = await response.json();
    // console.log('[TOKENS]', tokens);

    console.log('[REFRESHED ACCESS TOKEN]');
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
    async jwt({ token, user, account, profile }) {
      if (token?.error) delete token.error;
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

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number) * 1000) {
        // token.error = 'RefreshAccessTokenError';
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
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
        delete session.user.image;
        // console.log('session', { session, token, user });
        session.user.roles = await fetchAndExtractRoles(session.accessToken);
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // allow redirect to DA SSO logout page for federated signout
      if (url === 'https://login.voteda.org/logout') return url;
      return baseUrl;
    },
  },
};
export default NextAuth(authOptions);
