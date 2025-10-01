import "next-auth";
import "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
    accessToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id?: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    accessToken: string;
    error?: string;
  }
}
