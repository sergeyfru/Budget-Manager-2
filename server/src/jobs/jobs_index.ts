import { updateRateExchange } from "../services/currencies_service";
import cron from "node-cron";

export const startBackgroundJobs = async () => {
  try {
    updateRateExchange();

    cron.schedule("5 * * * *", async () => {
      console.log(`[CRON] Starting exchange rate update: ${new Date().toISOString()}`);
      await updateRateExchange();
      console.log(`[CRON] Exchange rate update completed: ${new Date().toISOString()}`);
    });
  } catch (error) {
    console.error(`[CRON] Exchange rates update failed`, error);
  }
};
