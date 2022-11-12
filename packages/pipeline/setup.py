from setuptools import find_packages, setup

setup(
    name="pipeline",
    packages=find_packages(exclude=["pipeline_tests"]),
    install_requires=[
        "dagster",
        "duckdb",
        "pandas"
    ],
    extras_require={"dev": ["dagit", "pytest"]},
)
