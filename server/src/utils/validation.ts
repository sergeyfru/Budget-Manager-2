import { z } from "zod";
import { ApiError } from "../errors/ApiErrors";

export const validateDB = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error("❌ DB Validation error:", result.error);
      throw new ApiError(500, "Invalid DB response");
    }
    console.log("✅  DB response is valid");
    return result.data;
 
};


export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("❌ Request Validation error:", result.error);
    throw new ApiError(400, "Invalid request data");
  }
 console.log("✅ Valid request data:", result.data);
  return result.data;
};

export const validateResponse = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
    const result = schema.safeParse(data);
  
    if (!result.success) {
      console.error("❌ Response Validation error:", result.error);
      throw new ApiError(500, "Invalid response data");
    }
    console.log("✅ Valid response data:", result.data);
    return result.data;
};