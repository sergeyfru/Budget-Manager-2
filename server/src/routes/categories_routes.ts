import express  from "express";
import {
    _createUserCategory,
    _deleteUserCategory,
    _getDefaultCategories,
    _getUserCategories,
    _updateUserCategory
} from "../controllers/categories_controller"
import { authMiddleware, validate } from "../middlewares/middleware";
import { reqCreateUserCategorySchema } from "../schemas/transaction_schema";

const router = express.Router()

router.get('/categories/default', _getDefaultCategories)
router.get('/categories',authMiddleware(),_getUserCategories)
router.post('/categories',authMiddleware(),validate(reqCreateUserCategorySchema), _createUserCategory)
router.patch('/categories/:id',authMiddleware(), validate(reqCreateUserCategorySchema), _updateUserCategory)
router.delete('/categories/:id',authMiddleware(),_deleteUserCategory)

export default router