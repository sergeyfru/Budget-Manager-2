import exporess from "express";
import {
  _login, _register, _logout,
  _change_password,
  _verify_phone_number, _refresh,
  _reset_password, _forgot_password,
} from "../controllers/auth_controller";

import { authMiddleware, validate } from "../middlewares/middleware";

import {
  reqChangePasswordSchema, reqForgotPasswordSchema,
  reqLoginSchema, reqRegisterSchema, reqResetPasswordSchema,
} from "@shared/core";

const router = exporess.Router();

router.post("/login", validate(reqLoginSchema), _login);
router.post("/register", validate(reqRegisterSchema), _register); 
router.post("/logout", _logout);
router.patch("/change-password", authMiddleware(), validate(reqChangePasswordSchema), _change_password);

router.put("/verify-phone-number", _verify_phone_number);

router.post("/refresh", _refresh);

router.post("/forgot-password", validate(reqForgotPasswordSchema), _forgot_password);
router.post("/reset-password", validate(reqResetPasswordSchema), _reset_password);

export default router;
