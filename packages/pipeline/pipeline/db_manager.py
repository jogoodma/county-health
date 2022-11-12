from pathlib import PurePath
from typing import Mapping
from duckdb import connect
from dagster import IOManager
import pandas as pd
from .utils.sql import SQL, sql_to_string


# https://github.com/petehunt/dagster-poor-mans-data-lake
# https://dagster.io/blog/duckdb-data-lake#-collecting_data_frames


def collect_dataframes(s: SQL) -> Mapping[str, pd.DataFrame]:
    dataframes = {}
    for key, value in s.bindings.items():
        if isinstance(value, pd.DataFrame):
            dataframes[f"df_{id(value)}"] = value
        elif isinstance(value, SQL):
            dataframes.update(collect_dataframes(value))
    return dataframes


class DuckDB:
    def __init__(self, options=""):
        self.options = options

    def query(self, select_statement: SQL):
        db = connect(":memory:")
        db.query("install httpfs; load httpfs;")
        db.query(self.options)

        dataframes = collect_dataframes(select_statement)
        for key, value in dataframes.items():
            db.register(key, value)

        result = db.query(sql_to_string(select_statement))
        if result is None:
            return
        return result.df()


class CountyHealthIOManager(IOManager):
    def __init__(self, outdir: PurePath, duckdb: DuckDB):
        self.outdir = outdir
        self.duckdb = duckdb

    def _get_path(self, context) -> str:
        if context.has_asset_key:
            asset_id = context.get_asset_identifier()
        else:
            asset_id = context.get_identifier()
        return str(self.outdir.joinpath(*asset_id).with_suffix(".parquet"))

    def handle_output(self, context, select_statement: SQL):
        """
        Exports the DuckDB query result to a parquet file.

        :param context:
        :param select_statement:
        :return:
        """
        if select_statement is None:
            return

        if not isinstance(select_statement, SQL):
            raise ValueError(
                f"Expected asset to return a SQL; got {select_statement!r}"
            )

        self.duckdb.query(
            SQL(
                "copy $select_statement to $db_file (format parquet)",
                select_statement=select_statement,
                db_file=self._get_path(context),
            )
        )

    def load_input(self, context) -> SQL:
        """
        Loads a parqet file into memory.

        :param context:
        :return:
        """
        return SQL("select * from read_parquet($db_file)", db_file=self._get_path(context))
