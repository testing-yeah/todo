import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const token = request.cookies.get('sessionId')

    if (token) {
        try {
            if (pathName == '/login' || pathName == '/signup') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.log('Invalid Token', token)
        }
    }

    const protectPaths = ['/', '/todoDetails/:path*']

    if (!token && protectPaths.some((path) => pathName.startsWith(path))) {
        if (pathName == '/signup') {
            return NextResponse.next()
        } else {
            if (pathName !== '/login') {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/signup', '/todoDetails/:path*']
}