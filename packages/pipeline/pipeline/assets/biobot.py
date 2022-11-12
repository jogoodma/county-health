from dagster import asset
import pandas as pd
from ..utils.sql import SQL


@asset
def biobot_covid_wastewater() -> SQL:
    df = pd.read_csv(
        "https://raw.githubusercontent.com/biobotanalytics/covid19-wastewater-data/master/wastewater_by_county.csv"
    )
    return SQL("SELECT * FROM $df", df=df)


# @asset
# def biobot_covid_cases_csv() -> None:
#     urllib.request.urlretrieve(
#         "https://github.com/biobotanalytics/covid19-wastewater-data/raw/master/cases_by_county.csv"
#     )
