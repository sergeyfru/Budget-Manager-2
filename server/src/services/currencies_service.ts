import { exchangeRateApiResponseSchema } from "@shared/core";
import { getNotExpiredCurrencies, updateCurrencyRateExchange } from "../models/currencies_model";
import { validateDB } from "../utils/validation";

export const updateRateExchange = async () => {
  const now = Math.floor(Date.now() / 1000);

  console.log(`[Exchange Rates] Checking for expired exchange rates (${new Date().toISOString()})`);

  try {
    const apiUrl =
      process.env.EXCHANGERATEAPI || `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATEAPIKEY}/latest/USD`;
    const dbResponse = await getNotExpiredCurrencies(now);

    if (dbResponse.length > 0) {
      console.log("Exchange rates are already up to date");
      return;
    }

    const rateExchangeApiResponse = await fetch(apiUrl).then((res) => res.json());

    const newRatesExchange = validateDB(exchangeRateApiResponseSchema, rateExchangeApiResponse);

    if (newRatesExchange.result === "error") {
      throw new Error(`Exchange API error: ${newRatesExchange["error-type"]}`);
    }

    const {
      conversion_rates,
      time_last_update_unix,
      time_next_update_unix,
      time_last_update_utc: currency_rate_updated_at,
    } = newRatesExchange;

    let updatedCount = 0;
    for (const currency_code in conversion_rates) {
      const rate = conversion_rates[currency_code];

      if (rate === undefined) continue;

      const affectedRow = await updateCurrencyRateExchange(currency_code, {
        currency_exchange_rate_usd: rate,
        currency_rate_updated_at,
        currency_time_last_update_unix: time_last_update_unix,
        currency_time_next_update_unix: time_next_update_unix,
      });

      updatedCount += affectedRow;
    }
    console.log(`Updated ${updatedCount} currencies. Source date: ${currency_rate_updated_at}`);
  } catch (error) {
    console.error("Error updating rate exchange:", error);
  }
};
