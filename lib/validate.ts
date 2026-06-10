import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizePayload } from "./sanitize";

/**
 * Middleware wrapper to validate incoming JSON requests against a Zod schema.
 * Sanitizes input (NoSQL/XSS protection) before validation.
 */
export function withValidation(schema: z.ZodTypeAny, handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      let body;
      try {
        body = await req.json();
      } catch (parseError) {
        return NextResponse.json(
          { success: false, message: "Invalid JSON format" },
          { status: 400 }
        );
      }
      
      // Sanitization Layer
      const sanitizedBody = sanitizePayload(body);
      
      // Validation Layer
      const result = schema.safeParse(sanitizedBody);
      
      if (!result.success) {
        const zodError: any = result.error;
        const errors = zodError.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return NextResponse.json({
          success: false,
          message: "Validation failed",
          errors
        }, { status: 400 });
      }

      // Intercept req.json() so handlers get the sanitized & validated payload
      req.json = async () => sanitizedBody;

      return handler(req, ...args);
    } catch (error: any) {
       console.error("Validation Middleware Error:", error);
       return NextResponse.json(
         { success: false, message: "Internal server error during validation" },
         { status: 500 }
       );
    }
  };
}
