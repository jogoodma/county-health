from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def verily_covid_wastewater() -> SQL:
    df = pd.read_csv("https://publichealth.verily.com/api/csv")
    return SQL("SELECT * FROM $df", df=df)
