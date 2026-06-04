import { updateRateExchange } from "../services/currencies_service";
import cron from "node-cron";

export const startBackgroundJobs = async () => {
  try {
    updateRateExchange();

    cron.schedule("5 * * * *", () => {
      updateRateExchange();
    });
    
  } catch (error) {
    console.error(error);
  }
};
