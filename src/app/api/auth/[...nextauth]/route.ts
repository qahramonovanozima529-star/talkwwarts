import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const dynamic = "force-dynamic";

const googleClientId = (process.env.GOOGLE_CLIENT_ID || "").replace(/^["']|["']$/g, "").trim();
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").replace(/^["']|["']$/g, "").trim();
const nextAuthSecret = (
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "talkwarts_super_secret_key_2026_safe_fallback"
).replace(/^["']|["']$/g, "").trim();

const providers: any[] = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// Credentials / Guest fallback provider so auth NEVER throws Internal Server Error
providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "Talkwarts Account",
    credentials: {
      name: { label: "Name", type: "text", placeholder: "Sardor" },
      email: { label: "Email", type: "email", placeholder: "user@example.com" },
    },
    async authorize(credentials) {
      const name = credentials?.name?.trim() || "Talkwarts Wizard";
      const email = credentials?.email?.trim() || "student@talkwarts.uz";
      return {
        id: `user-${Date.now()}`,
        name,
        email,
      };
    },
  })
);

const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = (profile as any)?.sub || user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  secret: nextAuthSecret,
  debug: false,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
