import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];
const GUARDED_PREFIXES = ["/dashboard", "/admin", "/profile"];

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname === path);
  const isGuarded = GUARDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!user && (isGuarded || !isPublic)) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;

    return NextResponse.redirect(url);
  }

  const next = new URL(request.url).searchParams.get("next");

  if (user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();

    url.pathname = next && next.startsWith("/") ? next : "/dashboard";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};