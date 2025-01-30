import { ResponseError } from "../utils/error.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status ? err.status : 500;
  const stack =
    process.env.NODE_ENV !== "production"
      ? err.stack.replace(/(\r\n|\n|\r)/gm, ":::").split(":::")
      : null; // replace any form of line break to make an array for better readability from stack

  if (err instanceof ResponseError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      msg: err.message,
      stack,
    });
  }

  return res.status(statusCode).json({
    success: false,
    msg: err.message || "Internal Server Error",
    stack,
  });
};
