import { db } from "../config/db";
import { dbErrorHandler } from "../errors/db_errors";
import { ApiError } from "../errors/ApiErrors";
import { getDefaultCategoriesQuery, getDefaultPaymentMethodsQuery } from "../db/queries";

import { validateDB } from "../utils/validation";

export const change_base_currency = ({user_id,base_currency_id}:{user_id:number,base_currency_id:number}) =>{
  const now = new Date()
  try {
    console.log(now);
    
    return db("users_settings").update({currency_id:base_currency_id,updated_at:now}).where({user_id})
    
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
    
  }
}