import type { DuckDbError, TableData } from "duckdb";
import { getDbConn } from ".";

export const STATE_COUNTIES = "../../data/db/all_counties_state.parquet";

export const getAllStateCounties = () => {
  const con = getDbConn();
  const stmt = con.prepare(`SELECT * FROM '${STATE_COUNTIES}'`);
  return new Promise<TableData>((resolve, reject) => {
    stmt.all((err: DuckDbError | null, rows: TableData) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
