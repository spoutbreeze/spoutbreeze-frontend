import NextAuth, { Session } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires?: number;
    user?: any;
  }
}

// Extend the JWT type to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expires?: number;
    user?: any;
  }
}

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      authorization: {
        params: {
          // Request additional scopes if needed (e.g., profile, email, and offline_access to get refresh token)
          scope: "openid profile email offline_access"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // When signing in for the first time, account and profile will be available
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires = account.expires_at;
        token.user = profile;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure the session has the proper accessToken that FastAPI will validate
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expires = token.expires as number;
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };