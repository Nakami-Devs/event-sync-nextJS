import { SignJWT, jwtVerify } from 'jose'

const getSecret = () => new TextEncoder().encode(process.env.AUTH_SECRET)

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
