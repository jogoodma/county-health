import { Database } from "duckdb-async";

export const VERILY_WASTEWATER = "../../data/db/verily_wastewater.parquet";

export const getFluByCounty = async (
  fipscode: number,
  num_months: number = 3
) => {
  const db = await Database.create(":memory:");
  const stmt = await db.prepare(
    `SELECT Collection_Date AS date,
            Influenza_A_gc_g_dry_weight AS flu_A_g_dry_weight
       FROM '${VERILY_WASTEWATER}'
       WHERE County_FIPS = ?
         AND date_diff('month', date::DATE, current_date) <= ?::INTEGER 
         AND Influenza_A_gc_g_dry_weight IS NOT NULL
         ORDER BY date ASC
         `
  );
  const rows = await stmt.all(fipscode, num_months);
  db.close();
  return rows;
};
