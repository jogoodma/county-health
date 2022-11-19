import { Database } from "duckdb-async";

export const COVID_NAT_AVG = "../../data/db/biobot_covid_national_avg.parquet";
export const COVID_REGIONAL_AVG =
  "../../data/db/biobot_covid_cases_by_region.parquet";

export const getNationalAverage = async (num_months: number = 3) => {
  const db = await Database.create(":memory:");
  //const rows = await db.all(`SELECT datepart('month', date::DATE) AS month, datepart('year', date::DATE) AS year, avg_cases_per_100k FROM '${COVID_NAT_AVG}' WHERE date_diff('month', date::DATE, current_date) <= ${num_months} ORDER BY date ASC`);
  const rows = await db.all(
    `SELECT * FROM '${COVID_NAT_AVG}' WHERE date_diff('month', date::DATE, current_date) <= ${num_months} ORDER BY date ASC`
  );
  return rows;
};

export const getAveragesByRegion = async (num_months: number = 3) => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT display_name AS region, date, rolling_average_new_cases_centered AS rolling_avg FROM '${COVID_REGIONAL_AVG}' WHERE date_diff('month', date::DATE, current_date) <= ${num_months} ORDER BY region,date ASC`
  );
  return rows;
};

export const getRegions = async () => {
  const db = await Database.create(":memory:");
  const rows = await db.all(
    `SELECT DISTINCT display_name AS region FROM '${COVID_REGIONAL_AVG}'`
  );
  return rows;
};
