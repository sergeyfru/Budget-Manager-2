import exporess from "express";
import { authMiddleware } from "../middlewares/middleware";
import { _change_base_currency, _get_base_currency } from "../controllers/user_preferences_controller";

const router = exporess.Router();

router.get("/base-currency",authMiddleware() ,_get_base_currency);
router.patch("/base-currency",authMiddleware() ,_change_base_currency);


export default router;
