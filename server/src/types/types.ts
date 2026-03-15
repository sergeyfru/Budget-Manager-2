import { ApiError } from "../errors/ApiErrors";
import { UserInfoSchema } from "../schemas/user_auth_schema";

export type LoginResult =
  | { success: true; user: UserInfoSchema; access_token: string; refresh_token: string }
  | { success: false; error: ApiError };