/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import AppError from "./app-error";
import handleZodError from "./handle-zod-error";
import handlePrismaError from "./handle-prisma-error";
import handlePrismaValidationError from "./handle-prisma-validation-error";
import { TErrorSources } from "../interfaces/error";

/**
 * Global Error Handler for Next.js API Routes
 * Processes different error types and returns standardized error responses
 */
const globalErrorHandler = (err: any): NextResponse => {
  // Default values
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR as number;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // 2. Prisma Known Request Errors (e.g., unique constraint, not found)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // 3. Prisma Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // 4. Custom App Errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // 5. JSON Parse Errors (invalid request body)
  else if (err instanceof SyntaxError && err.message.includes("JSON")) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid JSON";
    errorSources = [
      {
        path: "body",
        message: "Request body contains invalid JSON.",
      },
    ];
  }
  // 6. Generic / Unknown Errors
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Log the error
  console.error("❌ Error:", {
    statusCode,
    message,
    errorSources,
    stack: err?.stack,
  });

  // Final Response Construction
  return NextResponse.json(
    {
      success: false,
      message,
      errorSources,
      // Only show detailed stack traces in Development
      stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
    },
    { status: statusCode }
  );
};

export default globalErrorHandler;
