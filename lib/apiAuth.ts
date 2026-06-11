import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Higher-Order Function to protect Next.js API routes with JWT and RBAC.
 * @param handler The API route handler function
 * @param allowedRoles Array of roles that can access this route (optional)
 */
export function withAuth(handler: Function, allowedRoles?: string[]) {
  // Check JWT_SECRET at module load time (build time)
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined. Authentication will fail.');
  }

  return async (req: Request, ...args: any[]) => {
    try {
      // 1. Get token from cookies or Authorization header
      let token: string | undefined = undefined;

      try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get("authToken") || cookieStore.get("token");
        token = cookie?.value ?? undefined;
      } catch (cookieError) {
        console.warn("Failed to read cookies:", cookieError);
        // Continue to check auth header
      }

      if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1]?.trim();
        }
      }

      if (!token) {
        console.warn("apiAuth: No token found in cookies (authToken/token) or headers.");
        return NextResponse.json(
          { success: false, message: "Unauthorized: No token provided" },
          { status: 401 }
        );
      }

      // 2. Verify JWT - check secret exists
      if (!JWT_SECRET) {
        console.error('Cannot verify token: JWT_SECRET is not configured');
        return NextResponse.json(
          { success: false, message: "Server configuration error" },
          { status: 500 }
        );
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
      } catch (verifyError: any) {
        console.warn("apiAuth: JWT Verification failed:", verifyError.message);
        const status = verifyError.name === "TokenExpiredError" ? 401 : 403;
        const message = verifyError.name === "TokenExpiredError"
          ? "Token expired. Please log in again."
          : "Invalid token. Authentication failed.";

        return NextResponse.json({ success: false, message }, { status });
      }

      // 3. Optional: Role check
      if (allowedRoles && allowedRoles.length > 0) {
        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          return NextResponse.json(
            { success: false, message: `Forbidden: Access denied for role '${decoded.role}'` },
            { status: 403 }
          );
        }
      }

      // 4. Call handler with decoded user data
      return handler(req, decoded, ...args);
    } catch (error: any) {
      console.error("Auth Middleware Unexpected Error:", error);

      // Don't leak internal error details
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 500 }
      );
    }
  };
}
