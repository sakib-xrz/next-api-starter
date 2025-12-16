/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import globalErrorHandler from "@/server/errors/global-error-handler";

type RouteHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Async wrapper for Next.js API route handlers
 * Catches errors and processes them through the global error handler
 */
const catchAsync = (fn: RouteHandler) => {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await fn(request, context);
    } catch (error) {
      // Delegate error handling to the global error handler
      return globalErrorHandler(error);
    }
  };
};

export default catchAsync;
