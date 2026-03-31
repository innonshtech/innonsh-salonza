import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { cookies } from "next/headers";

/**
 * Higher-Order Function to protect Next.js API routes with JWT and RBAC.
 * @param handler The API route handler function
 * @param allowedRoles Array of roles that can access this route (optional)
 */
export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (req: Request, ...args: any[]) => {
    try {
      let cookieStore = await cookies();
      let token = cookieStore.get("token")?.value;

      if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized: No token provided" },
          { status: 401 }
        );
      }

      // 2. Verify JWT
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // 3. Optional: Role check
      if (allowedRoles && allowedRoles.length > 0) {
        if (!decoded.role || !allowedRoles.includes(decoded.role)) {
          return NextResponse.json(
            { success: false, message: `Forbidden: Access denied for role '${decoded.role}'` },
            { status: 403 }
          );
        }
      }

      // 4. Attach user info to the request (standard way in Next.js is passing it to handler)
      // Since req is read-only in some environments, we pass user as a separate arg
      return handler(req, decoded, ...args);
    } catch (error: any) {
      console.error("Auth Middleware Error:", error.message);
      
      const status = error.name === "TokenExpiredError" ? 401 : 403;
      const message = error.name === "TokenExpiredError" 
        ? "Token expired. Please log in again." 
        : "Invalid token. Authentication failed.";

      return NextResponse.json({ success: false, message }, { status });
    }
  };
}
