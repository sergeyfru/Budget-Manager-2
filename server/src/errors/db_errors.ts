import { ApiError } from "./ApiErrors";

export const dbErrorHandler = (err: any): ApiError => {

  if(err instanceof ApiError) {
    console.log('Error is already an ApiError, rethrowing:', err);
    throw err;
  }

  if (err.code === "23505") {
    throw new ApiError(409, "Duplicate value");
  }

  if (err.code === "23503") {
    throw new ApiError(400, "Foreign key violation");
  }

  if (err.code === "23502") {
    throw new ApiError(400, "Missing required field");
  }

  throw new ApiError(500, "Database error");
};