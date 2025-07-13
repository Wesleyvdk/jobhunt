import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { UserService } from '@/lib/services/userService'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }