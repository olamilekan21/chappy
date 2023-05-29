import changePasswordAuthorize from "@/utils/changePasswordAuthorize";
import signinAuthorize from "@/utils/signinAuthorize";
import signupAuthorize from "@/utils/signupAuthorize";
import jwt_decode from "jwt-decode";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { TokenUser } from "../../../../typing";

const SignIn = CredentialsProvider({
  id: "signin",
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: { type: "email" },
    password: { type: "password" },
  },
  authorize: signinAuthorize,
});

const SignUp = CredentialsProvider({
  id: "signup",
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: { type: "email" },
    displayName: { type: "text" },
    birthday: { type: "date" },
    password: { type: "password" },
  },
  authorize: signupAuthorize,
});

const ChangePassword = CredentialsProvider({
  id: "change_password",
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: { type: "email" },
    token: { type: "text" },
    password: { type: "password" },
  },
  authorize: changePasswordAuthorize,
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [SignIn, SignUp, ChangePassword],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
};
export default NextAuth(authOptions);
