import express  from "express";
import {
    _createUserCategory,
    _deleteUserCategory,
    _getDefaultCategories,
    _getUserCategories,
    _updateUserCategory
} from "../controllers/categories_controller"
import { authMiddleware, validate } from "../middlewares/middleware";
import { reqCreateUserCategorySchema, reqUpdateUserCategorySchema } from "@shared/core";

const router = express.Router()

router.get('/default', _getDefaultCategories)
router.get('/',authMiddleware(),_getUserCategories)
router.post('/',authMiddleware(),validate(reqCreateUserCategorySchema), _createUserCategory)
router.patch('/:id',authMiddleware(), validate(reqUpdateUserCategorySchema), _updateUserCategory)
router.delete('/:id',authMiddleware(),_deleteUserCategory)

export default router