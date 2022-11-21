from dagster import asset
from .biobot import biobot_covid_wastewater, biobot_covid_cases
from .verily import verily_fips
import pandas as pd
from ..utils.sql import SQL


@asset
def county_fips() -> SQL:
    """
    Fetches the county FIPS data.

    :return:
    """
    df = pd.read_csv(
        "https://raw.githubusercontent.com/ChuckConnell/articles/master/fips2county.tsv",
        sep="\t",
    )
    return SQL("SELECT * FROM $df", df=df)


@asset
def all_counties_state(biobot_covid_wastewater: SQL, biobot_covid_cases: SQL, verily_fips: SQL, county_fips: SQL) -> SQL:
    """
    Fetches all counties and states from the BioBot Covid wastewater dataset and the BioBot Covid case dataset.

    :param bio_bot_covid_wastewater:
    :param biobot_covid_cases:
    :return:
    """
    return SQL(
        """
        SELECT name AS county, state, fipscode FROM $bbcw
        UNION
        SELECT name AS county, state, fipscode FROM $bbcc
        UNION 
        -- The Verily dataset does not have County names, so we use the FIPS code to join with the county FIPS data.
        SELECT fips.CountyName AS county, fips.StateAbbr AS state, fips.countyFIPS AS fipscode
          FROM $fips AS fips JOIN $vfips AS vfips ON fips.countyFIPS::INTEGER = vfips.fipscode
        ORDER BY state, county
        """,
        bbcw=biobot_covid_wastewater,
        bbcc=biobot_covid_cases,
        vfips=verily_fips,
        fips=county_fips,
    )


