import NextAuth from "next-auth";
import CreadenialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { User } from "./model/user-model";
import { authConfig } from "./auth.config";

const refreshAccessToken = async (token) => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
    });
    const refreshedToken = await response.json();
    if (!response.ok) {
      throw refreshedToken;
    }

    return {
      ...token,
      accessToken: refreshedToken?.access_token,
      accessTokenExpires: Date.now() + refreshedToken?.expires_in * 1000,
      refreshToken: refreshedToken?.refresh_token,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    CreadenialsProvider({
      async authorize(credentials) {
        if (credentials == null) return null;

        try {
          const user = await User.findOne({ email: credentials?.email });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials?.password,
              user.password
            );
            if (isMatch) {
              return user;
            } else {
              throw new Error("Check your password");
            }
          } else {
            throw new Error("user not found");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     if (user && account) {
  //       return {
  //         accessToken: account?.access_token,
  //         accessTokenExpires: Date.now() + account?.expires_in * 1000,
  //         refreshToken: account?.refresh_token,
  //         user,
  //       };
  //     }

  //     if (Date.now() < token?.accessTokenExpires) {
  //       return token;
  //     }

  //     return refreshAccessToken(token);
  //   },

  //   async session({ session, token }) {
  //     session.user = token?.user;
  //     session.accessToken = token?.access_token;
  //     session.error = token?.error;

  //     return session;
  //   },
  // },
});
