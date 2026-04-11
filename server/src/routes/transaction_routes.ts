import express from "express";
import {
  _getTransactions,
  _getTransactionsByDateRange,
  _addTransaction,
  _updateTransaction,
  _deleteTransaction,
  _getTransactionTypes,
} from "../controllers/transaction_controller";
import { authMiddleware, validate } from "../middlewares/middleware";
import {
  createTransactionFormSchema, reqUpdateTransactionSchema
} from "@shared/core";

const router = express.Router();

router.get("/", 
    authMiddleware(), 
    _getTransactions);

router.post("/byDateRange",
  authMiddleware(),
  _getTransactionsByDateRange,
);
router.post("/",
  authMiddleware(),
  validate(createTransactionFormSchema),
  _addTransaction,
);
router.patch("/:id",
  authMiddleware(),
  validate(reqUpdateTransactionSchema),
  _updateTransaction,
);
router.delete("/:id",
    authMiddleware(),
    _deleteTransaction);

router.get("/transactiontypes", _getTransactionTypes);

export default router;
