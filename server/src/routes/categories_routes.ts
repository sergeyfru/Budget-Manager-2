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

router.get('/defaultCategories', _getDefaultCategories)
router.get('/getUsersCategories',authMiddleware(),_getUserCategories)
router.post('/createUserCategory',authMiddleware(),validate(reqCreateUserCategorySchema), _createUserCategory)
router.put('/updateUserCategory',authMiddleware(), validate(reqCreateUserCategorySchema), _updateUserCategory)
router.delete('/deleteUserCategory',authMiddleware(),_deleteUserCategory)

export default router