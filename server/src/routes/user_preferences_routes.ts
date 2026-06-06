import exporess from "express";
import { authMiddleware, validate } from "../middlewares/middleware";
import { reqLoginSchema } from "@shared/core";
import { _change_base_currency } from "../controllers/user_preferences_controller";

const router = exporess.Router();

router.patch("/base-currency",authMiddleware() ,_change_base_currency);


export default router;
