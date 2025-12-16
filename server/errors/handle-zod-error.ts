import httpStatus from "http-status";
import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    return {
      message: issue.message,
      path: issue.path.length > 0 ? issue.path[issue.path.length - 1] : "",
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error!",
    errorSources,
  };
};

export default handleZodError;
