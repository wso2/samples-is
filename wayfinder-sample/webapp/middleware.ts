import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-url", request.nextUrl.pathname + request.nextUrl.search);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
