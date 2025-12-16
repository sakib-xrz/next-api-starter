/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { ZodError, ZodType } from "zod";

export interface ValidationResult {
  success: boolean;
  data?: any;
  error?: ZodError;
}

export const validateRequest = async (
  schema: ZodType<any>,
  req: NextRequest,
  body?: any
): Promise<ValidationResult> => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const cookies = Object.fromEntries(
      req.cookies.getAll().map((cookie) => [cookie.name, cookie.value])
    );

    const data = await schema.parseAsync({
      body: body,
      query: searchParams,
      params: {}, // params need to be passed separately in Next.js
      cookies: cookies,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error,
      };
    }
    throw error;
  }
};

export default validateRequest;
