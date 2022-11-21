import { Database } from "duckdb-async";

export const VERILY_WASTEWATER = "../../data/db/verily_wastewater.parquet";

export const getRsvByCounty = async (
  fipscode: number,
  num_months: number = 3
) => {
  const db = await Database.create(":memory:");
  const stmt = await db.prepare(
    `SELECT Collection_Date AS date,
            RSV_gc_g_dry_weight AS RSV_dry_weight
       FROM '${VERILY_WASTEWATER}'
       WHERE County_FIPS = ?
         AND date_diff('month', date::DATE, current_date) <= ?::INTEGER 
         AND RSV_gc_g_dry_weight IS NOT NULL
         ORDER BY date ASC
         `
  );
  return await stmt.all(fipscode, num_months);
};
