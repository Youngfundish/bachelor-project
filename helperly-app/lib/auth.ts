import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from 'jwt-decode';

// Extend the default User interface provided by NextAuth to include an optional accessToken property
declare module "next-auth" {
    interface User {
        accessToken?: string;
        refreshToken?: string;
    }
}
async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_SERVICE}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );
    if (!res.ok) throw new Error("Failed to refresh token");
    const data = await res.json();
    return {
      ...token,
      accessToken:         data.accessToken,
      refreshToken:        data.refreshToken,
      accessTokenExpires:  Date.now() + 15 * 60 * 1000, // or data.expiresIn
    };
  } catch (err) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_SERVICE}/auth/login`,
          {
            method:      "POST",
            headers:     { "Content-Type": "application/json" },
            body:        JSON.stringify(credentials),
          }
        );
        if (!res.ok) return null;
        const { accessToken, refreshToken } = await res.json();
        const user = {id: 'user-id', email: credentials?.email}
        return { ...user, accessToken, refreshToken };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // first sign in
      if (user && "accessToken" in user) {
        token.accessToken        = user.accessToken;
        token.refreshToken       = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
      }
      if (token.accessToken) {
        const decodedToken = jwtDecode<{
            userId: number;
            email: string;
            name: string;
            role: string;
            exp: number;
        }>(token.accessToken as string);
        // Assign common properties
        token.userId = decodedToken.userId;
        token.email = decodedToken.email;
        token.name = decodedToken.name;
        token.role = decodedToken.role;
    }
      // return early if token not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      // otherwise refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.token = token.accessToken as string;
      session.error       = token.error;
      session.user        = {
        ...session.user,
        name:     token.name,
        email:    token.email,
        role:     token.role,
        userId:   token.userId,
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge:   60 * 60,
    updateAge: 15 * 60,
  },
};

export default NextAuth(authOptions);
