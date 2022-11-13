from dagster import asset
from .biobot import biobot_covid_wastewater, biobot_covid_cases
from ..utils.sql import SQL


@asset
def all_counties_state(biobot_covid_wastewater: SQL, biobot_covid_cases: SQL) -> SQL:
    """
    Fetches all counties and states from the BioBot Covid wastewater dataset and the BioBot Covid case dataset.

    :param bio_bot_covid_wastewater:
    :param biobot_covid_cases:
    :return:
    """
    return SQL(
        """
        SELECT DISTINCT name AS county, state FROM $bbcw
        UNION
        SELECT DISTINCT name AS county, state FROM $bbcc
        """,
        bbcw=biobot_covid_wastewater,
        bbcc=biobot_covid_cases,
    )
