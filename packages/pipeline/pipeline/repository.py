from pathlib import PurePath, Path
from dagster import (
    load_assets_from_package_module,
    repository,
    io_manager,
    with_resources,
    resource,
)
from pipeline import assets
from pipeline.db_manager import DuckDB, CountyHealthIOManager


@resource(config_schema={"vars": str})
def duckdb(init_context):
    return DuckDB(init_context.resource_config["vars"])


@io_manager(required_resource_keys={"duckdb"})
def county_health_io_manager(init_context):

    output_dir = Path.cwd().joinpath('data', 'db')
    return CountyHealthIOManager(output_dir, init_context.resources.duckdb)


duckdb_localstack = duckdb.configured(
    {
        "vars": """
"""
    }
)


@repository
def county_health():
    return [
        with_resources(
            load_assets_from_package_module(assets),
            {"io_manager": county_health_io_manager, "duckdb": duckdb_localstack},
        )
    ]
