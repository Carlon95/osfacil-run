import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "os_facil_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await isValidSession(token);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isProtectedRoute && !valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/cadastro"],
};
