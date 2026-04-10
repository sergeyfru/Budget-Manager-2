import { Request, Response } from "express";
import {
    getDefaultPaymentMethods, getUserPaymentMethods,
    createUserPaymentMethod, updateUserPaymentMethod,
    deleteUserPaymentMethod
} from "../models/payment_methods_model";
import {
    ReqCreateUserPaymentMethod, ReqUpdateUserPaymentMethod,
    ResDefaultPaymentMethodTypesArr, ResSimple,
    ResUserPaymentMethod, ResUserPaymentMethodsArr
} from "@shared/core";


export const _getDefaultPaymentMethods = async (req: Request, res: Response<ResDefaultPaymentMethodTypesArr>) => {
    try {
        const defaultPaymentMethods = await getDefaultPaymentMethods();
        res.status(200).json({
            data:defaultPaymentMethods,
            status: "success",
            message: "Default payment methods retrieved successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}

export const _getUserPaymentMethods = async (req: Request, res: Response<ResUserPaymentMethodsArr>) => {
    const user_id = req.user?.user_id as number;
    try {
        const userPaymentMethods = await getUserPaymentMethods(user_id);
        res.status(200).json({
            data: userPaymentMethods,
            status: "success",
            message: "User payment methods retrieved successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}

export const _createUserPaymentMethod = async (req: Request, res: Response<ResUserPaymentMethod>) => {
    const newUserPaymentMethod = req.body as ReqCreateUserPaymentMethod;
    try {
        const createdUserPaymentMethod = await createUserPaymentMethod(newUserPaymentMethod);
        res.status(201).json({
            data: createdUserPaymentMethod,
            status: "success",
            message: "User payment method created successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}

export const _updateUserPaymentMethod = async (req: Request, res: Response<ResUserPaymentMethod>) => {
    const user_payment_method_id = parseInt(req.params.id as string);
    const updatedPaymentMethod = req.body as ReqUpdateUserPaymentMethod;
    try {
        const updatedUserPaymentMethod = await updateUserPaymentMethod(user_payment_method_id, updatedPaymentMethod);
        res.status(200).json({
            data: updatedUserPaymentMethod,
            status: "success",
            message: "User payment method updated successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}

export const _deleteUserPaymentMethod = async (req: Request, res: Response<ResSimple>) => {
    const user_payment_method_id = parseInt(req.params.id as string);
    try {
        await deleteUserPaymentMethod(user_payment_method_id);
        res.status(200).json({
            status: "success",
            message: "Payment method deleted successfully",
        });
    } catch (error: any) {
        res.status(error.status || 500).json({
            status: "error",
            message: error.message,
        });
    }
}