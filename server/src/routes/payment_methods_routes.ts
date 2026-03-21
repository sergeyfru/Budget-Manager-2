import express from "express";

const router = express.Router();

import {
  _getDefaultPaymentMethods,
  _getUserPaymentMethods,
  _createUserPaymentMethod,
  _updateUserPaymentMethod,
  _deleteUserPaymentMethod,
} from "../controllers/payment_methods_controller";
import { authMiddleware } from "../middlewares/middleware";

router.get("/paymentmethods/default", _getDefaultPaymentMethods);
router.get("/paymentmethods", authMiddleware(), _getUserPaymentMethods);
router.post("/paymentmethods", authMiddleware(), _createUserPaymentMethod);
router.patch("/paymentmethods/:id", authMiddleware(), _updateUserPaymentMethod);
router.delete("/paymentmethods/:id", authMiddleware(), _deleteUserPaymentMethod);

export default router;
