import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from 'jwt-decode';
import { parse } from "cookie";

// Extend the default User interface provided by NextAuth to include an optional accessToken property
declare module "next-auth" {
    interface User {
        accessToken?: string;
        refreshToken?: string;
    }
}

async function refreshAccessToken(token: any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Important: send cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refreshToken: token.refreshToken,  // use the refreshToken you stored in JWT
          }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
  
      const data = await response.json();
  
      return {
        ...token,
        accessToken: data.access_token,
        accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
        refreshToken: token.refreshToken, // keep the same (cookie-based)
      };
    } catch (error) {
      console.error("Error refreshing access token:", error);
  
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  }

// Configuration options for NextAuth
export const authOptions: NextAuthOptions = {
    // Define authentication providers
    providers: [
        Credentials({
            type: "credentials", // Specifies the type of provider (e.g., username/password authentication)
            credentials: {
                email: { label: "Email", type: "text" }, // Email field definition
                password: { label: "Password", type: "password" }, // Password field definition
            },
            // Custom authorization logic for validating user credentials
            async authorize(credentials) {
                try {
                    // Send credentials to the backend API for authentication
                    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                        credentials: "include", // Include cookies in the request/response
                    });

                    // Handle failed authentication response
                    if (!response.ok) {
                        console.error("Login failed:", await response.text());
                        return null;
                    }

                    // Parse cookies from the response headers to extract the access token
                    const cookieHeader = response.headers.get('set-cookie');
                    if (!cookieHeader) {
                        throw new Error('Missing cookies in the response');
                    }

                    const cookies = parse(cookieHeader);
                    const accessToken = cookies.accessToken;
                    const refreshToken = cookies.refreshToken;
                    if (!accessToken) {
                        throw new Error('Access token missing in cookies');
                    }
                    console.log(cookies)

                    // Return user object with access token for subsequent operations
                    const user = { id: 'user-id', email: credentials?.email };
                    return { ...user, accessToken, refreshToken };
                } catch (error) {
                    // Log and handle errors during the authorization process
                    console.error("Error during authorization:", error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Add the access token from the user object to the token
            if (user && user.accessToken) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
            }

            // Decode the access token to extract user details
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
                token.exp = decodedToken.exp;
            }
            // If token is still valid, return it
            if (Date.now() < (token.exp as number) * 1000) {
                return token;
            }

            // Otherwise, refresh it
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            // Add the raw access token to the session
            session.token = token.accessToken as string;
            session.refreshToken = token.refreshToken;
            // Populate session user details
            session.user.userId = token.userId;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.role = token.role;

            return session; // Return the updated session
        },
    },
    session: {
        strategy: "jwt", // Use JWT tokens for session handling
        maxAge: 60 * 60, // Session expiration time: 1 hour (in seconds)
        updateAge: 60 * 60, // Revalidate session every 1 hour (in seconds)
    }
};

// Export the NextAuth instance with the configured options
export default NextAuth(authOptions);
