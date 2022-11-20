from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def biobot_covid_wastewater() -> SQL:
    df = pd.read_csv(
        "https://raw.githubusercontent.com/biobotanalytics/covid19-wastewater-data/master/wastewater_by_county.csv"
    )
    df["name"] = df["name"].str.split(pat=", ", expand=True)[0]
    return SQL("SELECT * FROM $df", df=df)


@asset
def biobot_covid_ww_by_region(biobot_covid_wastewater: SQL) -> SQL:
    """
    Calculates the average concentration for a region by week.

    :param biobot_covid_wastewater:
    :return:
    """
    return SQL(
        """SELECT sampling_week,
                  region, 
                  AVG(effective_concentration_rolling_average) AS avg_7day_conc 
                  FROM $bbcw GROUP BY region, sampling_week ORDER BY sampling_week DESC, region
        """,
        bbcw=biobot_covid_wastewater,
    )


@asset
def biobot_covid_cases() -> SQL:
    """
    Dagster asset that fetches the BioBot Covid case counts and stores them in a parquet file.

    :return:
    """
    df = pd.read_csv(
        "https://github.com/biobotanalytics/covid19-wastewater-data/raw/master/cases_by_county.csv"
    )
    df["name"] = df["name"].str.split(pat=", ", expand=True)[0]
    return SQL("SELECT * FROM $df", df=df)


@asset
def biobot_covid_cases_by_region() -> SQL:
    df = pd.read_csv(
        "https://raw.githubusercontent.com/biobotanalytics/covid19-wastewater-data/master/cases_by_region.csv"
    )
    return SQL("SELECT * FROM $df", df=df)


@asset
def biobot_covid_national_avg(biobot_covid_cases: SQL) -> SQL:
    """
    Calculates the national average concentration for a region by week.

    :param biobot_covid_wastewater:
    :return:
    """
    return SQL(
        """
        SELECT date,
               AVG(rolling_average_cases_per_100k_centered) AS avg_cases_per_100k
               FROM $bbcc GROUP BY date ORDER BY date DESC
        """,
        bbcc=biobot_covid_cases,
    )
