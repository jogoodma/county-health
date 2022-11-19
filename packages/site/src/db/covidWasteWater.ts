import { Database } from "duckdb-async";

export const COVID_REGIONAL_WASTE_WATER =
  "../../data/db/biobot_covid_ww_by_region.parquet";

export const getWasteWaterByRegion = async (num_months: number = 3) => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT region, sampling_week AS date, avg_7day_conc AS rolling_avg FROM '${COVID_REGIONAL_WASTE_WATER}' WHERE date_diff('month', date::DATE, current_date) <= ${num_months} ORDER BY region,date ASC`
  );
  return rows;
};

export const getWasteWaterRegions = async () => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT DISTINCT region FROM '${COVID_REGIONAL_WASTE_WATER}'`
  );
  return rows;
};
