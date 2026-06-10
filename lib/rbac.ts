import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { securityLogger } from "@/lib/logger";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  SALON_OWNER: "salon_owner",
  STAFF: "staff",
  SUPPLIER: "supplier",
  CUSTOMER: "customer"
};

export const PERMISSIONS = {
  MANAGE_USERS: [ROLES.SUPER_ADMIN],
  MANAGE_SALONS: [ROLES.SUPER_ADMIN],
  MANAGE_STAFF: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER],
  MANAGE_SERVICES: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER, ROLES.STAFF],
  MANAGE_INVENTORY: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER, ROLES.STAFF],
  MANAGE_CLIENTS: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER, ROLES.STAFF],
  MANAGE_BOOKINGS: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER, ROLES.STAFF],
  VIEW_REPORTS: [ROLES.SUPER_ADMIN, ROLES.SALON_OWNER],
};

export function hasPermission(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole);
}

/**
 * Middleware wrapper to strictly enforce Role-Based Access Control (Vertical Escalation Prevention)
 */
export function withRBAC(allowedRoles: string[], handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const token = req.cookies.get("authToken")?.value;
      if (!token) {
        securityLogger.warn("Missing authToken", { event: "unauthorized_access_attempt", ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"), url: req.nextUrl.pathname });
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      const decoded: any = verifyToken(token);
      if (!decoded) {
        securityLogger.warn("Invalid authToken", { event: "unauthorized_access_attempt", ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"), url: req.nextUrl.pathname });
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
      }
      
      if (!hasPermission(decoded.role, allowedRoles)) {
        securityLogger.warn("User attempted to access route without sufficient permissions", { event: "forbidden_access_attempt", userId: decoded.userId, role: decoded.role, url: req.nextUrl.pathname, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") });
        return NextResponse.json({ success: false, message: "Forbidden: Insufficient permissions" }, { status: 403 });
      }

      // Intercept request to ensure downstream handlers can easily access the user
      (req as any).user = decoded;

      return handler(req, ...args);
    } catch (error) {
      console.error("RBAC Middleware Error:", error);
      return NextResponse.json({ success: false, message: "Server error during authorization" }, { status: 500 });
    }
  };
}

/**
 * Validates ownership of a record by comparing its salonId with the user's salonId (Horizontal Escalation Prevention)
 */
export function assertOwnership(recordSalonId: string | undefined, userSalonId: string | undefined, userRole: string) {
  if (userRole === ROLES.SUPER_ADMIN) {
    return true; // Super admins can bypass
  }
  
  if (!recordSalonId || !userSalonId) {
    throw new Error("Missing ownership context");
  }

  if (recordSalonId.toString() !== userSalonId.toString()) {
    throw new Error("Forbidden: Cross-tenant access attempt detected");
  }
  
  return true;
}
