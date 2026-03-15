import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiErrors";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json(
        result.error.issues.map((issue) => {
          return {
            [issue.path.join(".")]: issue.message,
          };
        }),
      );
    }

    req.body = result.data;

    next();
  };


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });

};


