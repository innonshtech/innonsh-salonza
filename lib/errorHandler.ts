import { NextResponse } from "next/server";

/**
 * Centralized error handling utility for API routes
 * Ensures consistent error responses and proper logging
 */
export function handleError(error: unknown, context?: string): NextResponse {
  console.error(`[Error${context ? ` in ${context}` : ''}]`, {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    error
  });

  // Determine appropriate status code and message
  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, message: 'Token expired. Please log in again.' },
        { status: 401 }
      );
    }

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Invalid token. Authentication failed.' },
        { status: 403 }
      );
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      // Check for duplicate key error (code 11000)
      const mongoError = error as any;
      if (mongoError.code === 11000) {
        return NextResponse.json(
          { success: false, message: 'Resource already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, message: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (error.name === 'TypeError') {
      // Common TypeErrors like undefined property access
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }
  }

  // Generic server error for unknown issues
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  );
}

/**
 * Wrapper function to execute async API handlers with automatic error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (error) {
    return handleError(error, context);
  }
}
