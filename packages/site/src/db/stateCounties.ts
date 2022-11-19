import { Database } from "duckdb-async";

export const STATE_COUNTIES = "../../data/db/all_counties_state.parquet";

export const getAllStateCounties = async () => {
  const db = await Database.create(":memory:");
  const rows = await db.all(`SELECT * FROM '${STATE_COUNTIES}'`);
  return rows;
};
