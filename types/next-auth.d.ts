import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Расширение типа User для включения дополнительных полей
   */
  interface User {
    id: string
    name: string
    email: string
    image?: string
  }

  /**
   * Расширение типа Session для включения дополнительных полей
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * Расширение типа JWT для включения дополнительных полей
   */
  interface JWT {
    id: string
  }
}
