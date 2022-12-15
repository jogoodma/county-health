from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def verily_wastewater() -> SQL:
    df = pd.read_csv("https://publichealth.verily.com/api/csv")

    # Several fixes for the 'County_FIPS' column.
    # Replace the county name with the FIPS code.
    df["County_FIPS"] = df["County_FIPS"].replace("Alameda", "06001")
    df["County_FIPS"] = df["County_FIPS"].replace("Stanislaus", "06099")
    df["County_FIPS"] = df["County_FIPS"].replace("Yolo", "06113")

    # Look for rows with multiple FIPS codes in a single cell.
    county_fips_with_multiple_counties = df["County_FIPS"].str.contains(",", na=False)
    # Copy them into a new dataframe.
    multi_fips_rows = df[county_fips_with_multiple_counties]
    # Remove them.
    df.drop(multi_fips_rows.index, inplace=True)

    # Split the FIPS codes into separate rows and reinsert them into the dataframe.
    for idx, row in multi_fips_rows.iterrows():
        for fips in row["County_FIPS"].split(","):
            df = pd.concat([df, row], ignore_index=True)
            df.iloc[-1, df.columns.get_loc("County_FIPS")] = fips

    return SQL("SELECT * FROM $df", df=df)


@asset
def verily_fips(verily_wastewater: SQL) -> SQL:
    return SQL(
        """
        SELECT DISTINCT County_FIPS::INTEGER AS fipscode FROM $vcw WHERE County_FIPS IS NOT NULL AND regexp_matches(County_FIPS, '^[0-9]+$')
        """,
        vcw=verily_wastewater,
    )
