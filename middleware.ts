import {NextRequest, NextResponse} from "next/server";
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest){
    const isLoginRoute = req.nextUrl.pathname === '/api/admin/login'

    const isAdminRoute =
        req.nextUrl.pathname.startsWith('/api/admin') ||
        (req.nextUrl.pathname.startsWith('/api/events') && req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/speakers') && req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/sessions') && req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/rooms') && req.method !== 'GET')

    if(isAdminRoute && !isLoginRoute){
        const token = await getToken({ req, secret: process.env.AUTH_SECRET });
        if(!token){
            return NextResponse.json(
                { message: 'Accès non autorisé'},
                { status: 401 }
            )
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*']
}