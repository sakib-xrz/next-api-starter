import { prisma } from "@/server/lib/prisma";
import { createUserSchema } from "@/server/schemas/users";
import { AppError, catchAsync, sendResponse } from "@/server/utils";
import httpstatus from "http-status";
import { NextRequest } from "next/server";

export const GET = catchAsync(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  return sendResponse({
    statusCode: httpstatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

export const POST = catchAsync(async (request: NextRequest) => {
  const body = await request.json();

  const payload = createUserSchema.parse(body);

  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(
      httpstatus.CONFLICT,
      "User with this email already exists"
    );
  }

  const user = await prisma.user.create({
    data: payload,
  });

  return sendResponse({
    statusCode: httpstatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
});
