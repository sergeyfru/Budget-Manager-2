import exporess from "express";
import {
  _login,
  _register,
  _changePassword,
  _logout,
  _veriyfy_email,
  _verify_phone_number,
  _refresh,
  _forgotPassword,
  _resetPassword,
} from "../controllers/auth_controller";
import { validate } from "../middlewares/middleware";
import {
  req_change_password_schema,
  req_forgot_password_schema,
  req_login_schema,
  req_register_schema,
  req_reset_password_schema,
} from "../schemas/user_auth_schema";

const router = exporess.Router();

router.post("/login", validate(req_login_schema), _login);
router.post("/register", validate(req_register_schema), _register);
router.post("/logout", _logout);
router.put(
  "/change-password",
  validate(req_change_password_schema),
  _changePassword,
);

router.get('/verify-email', _veriyfy_email);
router.put('/verify_phone_number', _verify_phone_number);

router.post("/refresh", _refresh);

router.post(
  "/forgot-password",
  validate(req_forgot_password_schema),
  _forgotPassword,
);
router.post(
  "/reset-password",
  validate(req_reset_password_schema),
  _resetPassword,
);

export default router;
