/* eslint-disable @typescript-eslint/no-explicit-any */
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
        // Llamada directa al backend de NestJS
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        // Si la respuesta es OK y contiene el access_token, devolvemos el objeto.
        // NextAuth lo pasará al callback 'jwt'.
        if (res.ok && user?.access_token) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 'user' solo está disponible en el primer login.
      // Si es el inicio de sesión, decodificamos y guardamos el email.
      if (user && (user as any).access_token) {
        const userWithToken = user as any;
        token.accessToken = userWithToken.access_token;
        try {
          const decoded = JSON.parse(Buffer.from(userWithToken.access_token.split('.')[1], 'base64').toString());
          token.email = decoded.email;
        } catch (error) {
          console.error("Error decodificando el token:", error);
          token.email = "";
        }
      }
      // En las siguientes llamadas, 'token' ya tendrá el email
      // y el accessToken, por lo que solo lo retornamos.
      return token;
    },
    async session({ session, token }) {
      // Ahora solo pasamos los datos que ya están en el token a la sesión del cliente.
      session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
