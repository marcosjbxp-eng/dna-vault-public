import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  
  // Verifica se existe algum dos cookies de sessão do NextAuth / Auth.js
  const hasSession = 
    cookies.has("authjs.session-token") ||
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token");

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isCheckoutRoute = nextUrl.pathname.startsWith("/checkout");

  if ((isAdminRoute || isCheckoutRoute) && !hasSession) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
