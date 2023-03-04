import { Database } from "duckdb-async";

export const COVID_REGIONAL_WASTE_WATER =
  "../../data/db/biobot_covid_ww_by_region.parquet";
export const COVID_WASTE_WATER =
  "../../data/db/biobot_covid_wastewater.parquet";

export const getWasteWaterByRegion = async (num_months: number = 3) => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT region, sampling_week AS date, avg_7day_conc AS rolling_avg FROM '${COVID_REGIONAL_WASTE_WATER}' WHERE date_diff('month', date::DATE, current_date) <= ${num_months} ORDER BY region,date ASC`
  );
  db.close();
  return rows;
};

export const getWasteWaterRegions = async () => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT DISTINCT region FROM '${COVID_REGIONAL_WASTE_WATER}'`
  );
  db.close();
  return rows;
};

export const getCovidWasteWaterByCounty = async (
  state: string,
  county: string,
  num_months: number = 3
) => {
  const db = await Database.create(":memory:");
  const stmt = await db.prepare(
    `SELECT sampling_week AS date,
            effective_concentration_rolling_average AS rolling_avg
     FROM '${COVID_WASTE_WATER}'
     WHERE state = ?::STRING
       AND name = ?::STRING
       AND date_diff('month', date::DATE, current_date) <= ${num_months}
     ORDER BY date ASC`
  );
  const rows = await stmt.all(state, county);
  db.close();
  return rows;
};
