import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiErrors";
import { getUserFromToken } from "../utils/token";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error);
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;

    next();
  };

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
};

export const authMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    console.log("auth Middleware");

    const authHeader =
      req.headers["authorization"] || (req.cookies.access_token as string);
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided, authorization denied",
      });
    }
    console.log("authHeader", authHeader);

    const access_token = authHeader.split(" ")[1];
    if (!access_token) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const user = await getUserFromToken(access_token);
    console.log("user in Middleware", user);

    req.user = user;

    next();
  };
