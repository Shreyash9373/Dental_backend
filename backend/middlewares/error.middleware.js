export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status ? err.status : 500;
    res.status(statusCode).json({
      ok: false,
      msg: err.message || "Internal Server Error",
      stack:
        process.env.NODE_ENV !== "production"
          ? err.stack.replace(/(\r\n|\n|\r)/gm, ":::").split(":::")
          : null, // replace any form of line break to make an array for better readability from stack
    });
  };