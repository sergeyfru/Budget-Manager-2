import { db } from "../config/db";
import { dbErrorHandler } from "../errors/db_errors";

export const change_base_currency = ({ user_id, base_currency_id }: { user_id: number; base_currency_id: number }) => {
  const now = new Date();
  try {
    return db("users_settings").update({ base_currency_id, updated_at: now }).where({ user_id });
  } catch (error) {
    console.error(error);
    throw dbErrorHandler(error);
  }
};

export const get_base_currency_id = (user_id:number)=>{
  return db("users_settings").where({user_id}).select('base_currency_id').first()
}

export const get_base_currency_full = (currency_id:number) =>{
  return db("currencies").where({currency_id}).first()
}