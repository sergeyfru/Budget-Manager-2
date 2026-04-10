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

router.get("/getTransactions", 
    authMiddleware(), 
    _getTransactions);

router.post("/getTransactionsByDateRange",
  authMiddleware(),
  _getTransactionsByDateRange,
);
router.post("/addTransaction",
  authMiddleware(),
  validate(createTransactionFormSchema),
  _addTransaction,
);
router.put("/updatetransaction",
  authMiddleware(),
  validate(reqUpdateTransactionSchema),
  _updateTransaction,
);
router.delete("/deleteTransaction", 
    authMiddleware(), 
    _deleteTransaction);

router.get("/transactiontypes", _getTransactionTypes);

export default router;
