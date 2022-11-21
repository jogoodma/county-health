# county-health

A data aggregation and visualization tool for health metrics for US Counties.


## Description

This project is a data aggregation and visualization tool for health metrics for US Counties. It integrates data from BioBot, Verily, and others to provide a comprehensive view of health metrics for US Counties.

The site is currently hosted at [County Health](https://jogoodma.github.io/county-health/).
## Requirements

In order to run this project locally for development purposes, you will need to have the following installed:

- [Node.js](https://nodejs.org/en/) - v18
- [pnpm](https://pnpm.js.org/en/installation) - v7.x
- [Python 3](https://www.python.org/downloads/) - 3.9.x

## Getting Started

The following steps will get you a copy of the project up and running on your local machine for development and testing purposes. It assumes that you have the requirements listed above installed. A python virtual environment is recommended.

```
# Clone the repository
git clone https://github.com/jogoodma/county-health.git

# Install Python dependencies 
cd county-health
pip install -r packages/pipelines/requirements.txt

# Install Node dependencies
cd packages/site && pnpm install

# Run the data pipeline to update your local data.
cd ../../
make update

# Run the site locally
cd packages/site && pnpm run dev
```

## Directory Structure

```
.
├── data
│   └── db - Parquet files for DuckDB
└── packages
    ├── pipeline - Pipeline code for integrating datasets (Dagster)
    └── site - Static site builder code (Astro)
```

## Data Sources

- [BioBot](https://biobot.io/)
- [BioBot Github](https://github.com/biobotanalytics/covid19-wastewater-data)
- [Verily](https://publichealth.verily.com/)
- [US County FIPS Data](https://raw.githubusercontent.com/ChuckConnell/articles/master/fips2county.tsv)
