import { Request } from "express";

import {UserInfoSchema} from "../../schemas/user_auth_schema";

declare global {
  namespace Express {
    export interface Request { 
      user: UserInfoSchema; 
    }
  }
}
