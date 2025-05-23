'use server'

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("access-token")?.value;
    const isHost = request.cookies.get("isHost")?.value;

    if (!session) {
        const intendedUrl = request.nextUrl.pathname;
        return NextResponse.redirect(new URL(`/login?redirect=${intendedUrl}`, request.url));
    }
    
    // if (session) {
    // }

    try {
        // Decode the token and extract the UID if needed
        // const decodedToken = await admin.auth().verifyIdToken(session);
        // const uid = decodedToken.uid;
        // response.headers.set("x-user-id", uid);

        const response = NextResponse.next();

        // Extend session cookie expiration
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        response.cookies.set("session", session, {
            httpOnly: true,
            expires,
        });

        // Check if the user is trying to access /hostpanel and is not a host
        if (request.nextUrl.pathname.startsWith("/hostpanel") && isHost !== "yes") {
            alert("Access denied");
            return NextResponse.redirect(new URL('/request', request.url));
             // Replace /somewhere_else with the appropriate path
        }

        return response;
    } catch (error) {
        console.error('Invalid token:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ["/profile/:path*", "/hostpanel/:path*" , "/request"], // Add /hostpanel paths to the matcher
};
