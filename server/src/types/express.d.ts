import { Request } from "express";

import { UserDB } from "@shared/core";

declare global {
  namespace Express {
    export interface Request { 
      user: UserDB; 
    }
  }
}
