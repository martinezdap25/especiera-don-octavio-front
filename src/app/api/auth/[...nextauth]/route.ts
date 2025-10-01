import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials.password) {
              return null;
            }
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });
    
            if (!res.ok) {
              return null;
            }
    
            const data = await res.json();
    
            if (data?.access_token && data?.user) {
              return {
                ...data.user, // id, email, name
                accessToken: data.access_token,
              };
            }
    
            return null;
          },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.email = user.email ?? undefined
            token.accessToken = user.accessToken
          }
          return token;
        },
        async session({ session, token }) {
          session.user = { id: token.id, name: token.name, email: token.email };
          session.accessToken = token.accessToken;
          return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };