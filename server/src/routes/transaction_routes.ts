import express from "express";
import { _getUsersTransactions, _getUsersTransactionsByDateRange, _addTransaction } from "../controllers/transaction_controller";
import { validate } from "../middlewares/middleware";
import { reqAddTransactionSchema } from "../schemas/transaction_schema";

const router = express.Router();

router.get("/getUsersTransactions", _getUsersTransactions );
router.post("/getUsersTransactionsByDateRange", _getUsersTransactionsByDateRange);
router.post("/addTransaction", validate(reqAddTransactionSchema), _addTransaction);


export default router;