class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | undefined, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else if (typeof Error.captureStackTrace === "function") {
      // captureStackTrace is V8-specific (Node.js, Chrome)
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
