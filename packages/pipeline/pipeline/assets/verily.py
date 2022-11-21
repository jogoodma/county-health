from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def verily_covid_wastewater() -> SQL:
    df = pd.read_csv("https://publichealth.verily.com/api/csv")
    return SQL("SELECT * FROM $df", df=df)


@asset
def verily_fips(verily_covid_wastewater: SQL) -> SQL:
    return SQL(
        """
        SELECT DISTINCT County_FIPS::INTEGER AS fipscode FROM $vcw WHERE County_FIPS IS NOT NULL AND regexp_matches(County_FIPS, '^[0-9]+$')
        """,
        vcw=verily_covid_wastewater,
    )
