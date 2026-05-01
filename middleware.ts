import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAdminRoute = req.nextUrl.pathname.startsWith('/api/admin') ||
        (req.nextUrl.pathname.startsWith('/api/events') &&
         req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/speakers') &&
         req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/sessions') &&
         req.method !== 'GET') ||
        (req.nextUrl.pathname.startsWith('/api/rooms') &&
         req.method !== 'GET ')

    if(isAdminRoute && !isLoggedIn) {
        return NextResponse.json(
            { message : 'Not authorized'},
            { status: 401 }
        )
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/api/:path*'],
}