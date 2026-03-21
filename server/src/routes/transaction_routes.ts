import express from "express";
import { _getTransactions, _getTransactionsByDateRange, _addTransaction, _updateTransaction, _deleteTransaction } from "../controllers/transaction_controller";
import { authMiddleware, validate } from "../middlewares/middleware";
import { reqAddTransactionSchema, reqUpdateTransactionSchema } from "../schemas/transaction_schema";

const router = express.Router();

router.get("/getTransactions",authMiddleware(), _getTransactions );
router.post("/getTransactionsByDateRange", authMiddleware(), _getTransactionsByDateRange);
router.post("/addTransaction", authMiddleware(), validate(reqAddTransactionSchema), _addTransaction);
router.put('/updatetransaction',authMiddleware(), validate(reqUpdateTransactionSchema), _updateTransaction)
router.delete('/deleteTransaction',authMiddleware(), _deleteTransaction)


export default router;