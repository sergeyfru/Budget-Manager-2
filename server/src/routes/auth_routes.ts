import exporess from "express";
import {
  _login, _register, _logout,
  _changePassword, _veriyfy_email,
  _verify_phone_number, _refresh,
  _forgotPassword, _resetPassword,
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
router.put("/change-password", authMiddleware(), validate(reqChangePasswordSchema), _changePassword);

router.get("/verify-email", _veriyfy_email);
router.put("/verify_phone_number", _verify_phone_number);

router.post("/refresh", _refresh);

router.post("/forgot-password", validate(reqForgotPasswordSchema), _forgotPassword);
router.post("/reset-password", validate(reqResetPasswordSchema), _resetPassword);

export default router;
