from pipeline.assets.biobot import biobot_covid_wastewater
from pipeline.db_manager import DuckDB


def test_biobot():
    bcw = biobot_covid_wastewater()
    assert bcw.sql == "SELECT * FROM $df"

