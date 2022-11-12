from string import Template
import pandas as pd
from sqlescapy import sqlescape

# https://github.com/petehunt/dagster-poor-mans-data-lake
# https://dagster.io/blog/duckdb-data-lake#-collecting_data_frames


class SQL:
    """
    Representation of a SQL statement with value bindings.
    """

    def __init__(self, sql: str, **bindings):
        self.sql = sql
        self.bindings = bindings


def sql_to_string(s: SQL) -> str:
    replacements = {}
    for key, value in s.bindings.items():
        if isinstance(value, pd.DataFrame):
            replacements[key] = f"df_{id(value)}"
        elif isinstance(value, SQL):
            replacements[key] = f"({sql_to_string(value)})"
        elif isinstance(value, str):
            replacements[key] = f"'{sqlescape(value)}'"
        elif isinstance(value, (int, float, bool)):
            replacements[key] = str(value)
        elif value is None:
            replacements[key] = "null"
        else:
            raise ValueError(f"Invalid type for {key}")
    return Template(s.sql).safe_substitute(replacements)
