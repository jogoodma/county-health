import duckdb, { Connection } from "duckdb";

/*
  Forward all exports.
*/
export * from "./queries";

export const getDbConn = (db: string = ":memory:"): Connection => {
  return new duckdb.Database(db).connect();
};
