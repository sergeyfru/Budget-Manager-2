import { Request, Response } from "express";
import {
    getDefaultPaymentMethods,
    getUserPaymentMethods,
    createUserPaymentMethod,
    updateUserPaymentMethod,
    deleteUserPaymentMethod
} from "../models/payment_methods_model";
import { ReqCreateUserPaymentMethodSchema } from "../schemas/transaction_schema";


export const _getDefaultPaymentMethods = async (req: Request, res: Response) => {
    try {
        const defaultPaymentMethods = await getDefaultPaymentMethods();
        res.status(200).json({
            defaultPaymentMethods,
            status: "success",
            message: "Default payment methods retrieved successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}

export const _getUserPaymentMethods = async (req: Request, res: Response) => {
    const user_id = req.user?.user_id as number;
    try {
        const userPaymentMethods = await getUserPaymentMethods(user_id);
        res.status(200).json({
            userPaymentMethods,
            status: "success",
            message: "User payment methods retrieved successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}

export const _createUserPaymentMethod = async (req: Request, res: Response) => {
    const newUserPaymentMethod = req.body as ReqCreateUserPaymentMethodSchema;
    try {
        const createdUserPaymentMethod = await createUserPaymentMethod(newUserPaymentMethod);
        res.status(201).json({
            createdUserPaymentMethod,
            status: "success",
            message: "User payment method created successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}

export const _updateUserPaymentMethod = async (req: Request, res: Response) => {
    const user_payment_method_id = parseInt(req.params.id as string);
    const updatedPaymentMethod = req.body as ReqCreateUserPaymentMethodSchema;
    try {
        const updatedUserPaymentMethod = await updateUserPaymentMethod(user_payment_method_id, updatedPaymentMethod);
        res.status(200).json({
            updatedUserPaymentMethod,
            status: "success",
            message: "User payment method updated successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}

export const _deleteUserPaymentMethod = async (req: Request, res: Response) => {
    const user_payment_method_id = parseInt(req.params.id as string);
    try {
        await deleteUserPaymentMethod(user_payment_method_id);
        res.status(200).json({
            status: "success",
            message: "User payment method deleted successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            error: error.message,
        });
    }
}