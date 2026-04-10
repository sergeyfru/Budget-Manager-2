import express from "express";

const router = express.Router();

import {
  _getDefaultPaymentMethods,
  _getUserPaymentMethods,
  _createUserPaymentMethod,
  _updateUserPaymentMethod,
  _deleteUserPaymentMethod,
} from "../controllers/payment_methods_controller";
import { authMiddleware, validate } from "../middlewares/middleware";
import { reqCreateUserPaymentMethodSchema, reqUpdateUserPaymentMethodSchema } from "@shared/core";

router.get("/paymentmethods/default", _getDefaultPaymentMethods);
router.get("/paymentmethods", authMiddleware(), _getUserPaymentMethods);
router.post("/paymentmethods", authMiddleware(), validate(reqCreateUserPaymentMethodSchema), _createUserPaymentMethod);
router.patch("/paymentmethods/:id", authMiddleware(), validate(reqUpdateUserPaymentMethodSchema), _updateUserPaymentMethod);
router.delete("/paymentmethods/:id", authMiddleware(), _deleteUserPaymentMethod);

export default router;
