import { NextResponse } from "next/server";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T | null;
};

const sendResponse = <T>(data: ApiResponse<T>): NextResponse => {
  const responseData: ApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || undefined,
    data: data.data !== undefined ? data.data : null,
  };

  return NextResponse.json(responseData, { status: data.statusCode });
};

export default sendResponse;
