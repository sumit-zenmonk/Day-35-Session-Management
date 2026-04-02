import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ['/public', '/login', '/signup','/otp'];
const authBlockRoutes = ['/login', '/signup','/otp'];

export default function proxy(req: NextRequest) {
    const credentials = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;

    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`) || pathname.endsWith('.svg'));
    const isAuthBlock = authBlockRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthenticated = Boolean(credentials);

    if (isAuthenticated && isAuthBlock) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isPublic) {
        return NextResponse.next();
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/signup", req.url));
    }

    if (role === 'user' && pathname.startsWith('/lead')) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (role === 'team_lead' && pathname.startsWith('/user')) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};