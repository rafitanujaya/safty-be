import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.status || "Internal Server Error",
  });
};

export { errorHandler };
