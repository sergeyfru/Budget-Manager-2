import express from "express";
import { _getAllCurrencies } from "../controllers/currencies_controller";

const router = express.Router();

router.get("/", _getAllCurrencies);

export default router;