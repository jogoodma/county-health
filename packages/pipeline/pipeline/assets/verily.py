from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def verily_wastewater() -> SQL:
    df = pd.read_csv("https://publichealth.verily.com/api/csv")

    # Remove the row that has Alameda in the County_FIPS column.
    df["County_FIPS"] = df["County_FIPS"].replace("Alameda", "06001")
    return SQL("SELECT * FROM $df", df=df)


@asset
def verily_fips(verily_wastewater: SQL) -> SQL:
    return SQL(
        """
        SELECT DISTINCT County_FIPS::INTEGER AS fipscode FROM $vcw WHERE County_FIPS IS NOT NULL AND regexp_matches(County_FIPS, '^[0-9]+$')
        """,
        vcw=verily_wastewater,
    )
