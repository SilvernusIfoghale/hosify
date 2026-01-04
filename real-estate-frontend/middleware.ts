import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/landlord": ["landlord"],
  "/tenant": ["tenant"],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  if (requiredRoles) {
    const userRole = request.cookies.get("user_role")?.value;

    //  console.log(`Middleware running on: ${pathname}`);

    if (!userRole || !requiredRoles.includes(userRole?.toLowerCase())) {
      const url = request.nextUrl.clone();
      //  console.log(`User Role Cookie Value: ${userRole}`);
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/landlord/:path*", "/tenant/:path*"],
};
