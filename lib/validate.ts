import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Middleware wrapper to validate incoming JSON requests against a Zod schema.
 * Rejects with 400 Bad Request if validation fails.
 */
export function withValidation(schema: z.ZodTypeAny, handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      // Clone request so the underlying handler can still call req.json() if it wants to
      const clonedReq = req.clone();
      
      let body;
      try {
        body = await clonedReq.json();
      } catch (parseError) {
        return NextResponse.json(
          { success: false, message: "Invalid JSON format" },
          { status: 400 }
        );
      }
      
      const result = schema.safeParse(body);
      
      if (!result.success) {
        const zodError: any = result.error;
        console.warn("Zod Validation Failed:", zodError.errors);
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
