from dagster import load_assets_from_package_module, repository

from pipeline import assets


@repository
def pipeline():
    return [load_assets_from_package_module(assets)]
