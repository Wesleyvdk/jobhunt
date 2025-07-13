import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { UserService } from '@/lib/services/userService'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserService.validatePassword(
            credentials.email,
            credentials.password
          );

          if (user) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.image,
            };
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }

        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true; // Already validated in authorize
      }

      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user exists
          if (!user.email) {
            return false; // No email provided
          }

          let existingUser = await UserService.findUserByEmail(user.email);
          
          if (!existingUser) {
            // Create new user from OAuth
            existingUser = await UserService.createUser({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              provider: account.provider,
              providerId: account.providerAccountId,
              image: user.image || undefined,
            });
          }

          // Update user ID for session
          user.id = existingUser.id.toString();
          return true;
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 