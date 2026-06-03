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
    const response = NextResponse.next()
    
    const origin = req.headers.get('origin') || ''
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']
    
    if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count')

        if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: response.headers
        })
    }
    
    return response
}

export const config = {
    matcher: ['/api/:path*'],
    runtime: 'nodejs'
}