import { SignJWT, jwtVerify } from 'jose'

const getSecret = () => {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
    if (!secret) {
        throw new Error('Missing AUTH_SECRET or NEXTAUTH_SECRET')
    }

    return new TextEncoder().encode(secret)
}

export async function generateToken(payload: { id: string, email: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(getSecret())
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, getSecret())
    return payload
}
