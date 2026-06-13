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
