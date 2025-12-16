import httpStatus from "http-status";
import { prisma } from "@/server/lib/prisma";
import { AppError, catchAsync, sendResponse } from "@/server/utils";

export const GET = catchAsync(async (_request, context) => {
  const { id } = await context.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User with the specified ID does not exist"
    );
  }

  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});
