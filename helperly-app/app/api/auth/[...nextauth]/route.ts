import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth" // Note: named import, not default

const handler = NextAuth(authOptions) // Call NextAuth() with your options

export { handler as GET, handler as POST }