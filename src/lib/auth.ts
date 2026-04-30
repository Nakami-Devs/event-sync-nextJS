import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email et mot de passe requis')
                }

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!admin) {
                    throw new Error('Email ou mot de passe incorrect')
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    admin.password
                )

                if (!passwordMatch) {
                    throw new Error('Email ou mot de passe incorrect')
                }

                return { id: admin.id, email: admin.email }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        },
    },

    pages: {
        signIn: '/admin/login',
    },

    session: {
        strategy: 'jwt',
    },
})