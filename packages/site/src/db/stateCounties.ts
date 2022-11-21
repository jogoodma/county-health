import { Database } from "duckdb-async";

export const STATE_COUNTIES = "../../data/db/all_counties_state.parquet";

export const getAllStateCounties = async () => {
  const db = await Database.create(":memory:");
  const rows = await db.all(`SELECT * FROM '${STATE_COUNTIES}'`);
  return rows;
};

export const getFipsByStateCounty = async (state: string, county: string) => {
  const db = await Database.create(":memory:");
  const stmt = await db.prepare(
    `SELECT fipscode FROM '${STATE_COUNTIES}' WHERE state = ?::STRING AND county = ?::STRING`
  );
  const rows = await stmt.all(state, county);
  return Number.parseInt(rows[0].fipscode);
};
