// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Set ROOT_DOMAIN to your main domain (no subdomain).
 * Example: ROOT_DOMAIN=yourdomain.com
 *
 * For local dev you can use lvh.me (every subdomain resolves to 127.0.0.1)
 * Example: visit https://royalspa.lvh.me:3000
 */

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "yourdomain.com";

/** list of subdomains we reserve for the app or shouldn't rewrite */
const RESERVED = new Set([
  "www",
  "app",
  "api",
  "dashboard",
  "admin",
  "mail",
  "ftp",
  "localhost",
  "127",
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || ""; // may include port

  // strip port
  const hostname = host.split(":")[0];

  // If hostname is an IP or contains ROOT_DOMAIN
  // e.g. royalspa.yourdomain.com  => endsWith(ROOT_DOMAIN)
  // or for lvh.me dev hostnames like royalspa.lvh.me
  if (!hostname) return NextResponse.next();

  // If hostname equals ROOT_DOMAIN or is localhost / non-subdomain host -> don't rewrite
  if (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  // If hostname looks like a subdomain: subdomain.rootdomain
  // For local dev using lvh.me -> endsWith('lvh.me')
  const parts = hostname.split(".");
  if (parts.length < 2) return NextResponse.next();

  const subdomain = parts[0].toLowerCase();

  // Don't rewrite reserved subdomains
  if (RESERVED.has(subdomain)) return NextResponse.next();

  // Optionally: if the hostname does not end with ROOT_DOMAIN, still handle known dev host like lvh.me
  const isKnownRoot = hostname.endsWith(ROOT_DOMAIN) || hostname.endsWith("lvh.me");

  if (!isKnownRoot) {
    // unknown host (CI, preview, other) - don't rewrite
    return NextResponse.next();
  }

  // Build target path:
  // root request: https://royalspa.yourdomain.com/  -> rewrite to /royalspa/
  // request: https://royalspa.yourdomain.com/services -> /royalspa/services
  const pathname = url.pathname;
  const newPathname = `/${subdomain}${pathname}`;

  // Add a header so server components and APIs can read the slug easily
  const response = NextResponse.rewrite(new URL(newPathname + url.search, req.url));
  response.headers.set("x-salon-slug", subdomain);

  return response;
}

/**
 * Apply middleware to all paths except static/_next/api etc.
 * Adjust matcher to your needs.
 */
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
