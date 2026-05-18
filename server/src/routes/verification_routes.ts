import express from "express";
import {
  _resend_verification_email,
  _check_email_verification,
  _verify_email,
} from "../controllers/verification_controller";
import { validate } from "../middlewares/middleware";
import { reqVerificationEmailSchema } from "@shared/core";

const router = express.Router();

router.get("/verify-email", _verify_email);
router.post("/resend", validate(reqVerificationEmailSchema), _resend_verification_email);
router.get("/check-status", _check_email_verification);

export default router;
