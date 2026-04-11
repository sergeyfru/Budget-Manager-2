import { z } from "zod";

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: dataSchema,
  });

export const apiErrorSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion("status", [apiSuccessSchema(dataSchema), apiErrorSchema]);


export const resSimpleSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    message: z.string(),
  }),
  apiErrorSchema,
]);

export type ResSimple = z.infer<typeof resSimpleSchema>;

