DATA_DIR := data/db/*

all: update build

clean:
	rm -f ${DATA_DIR}

update:
	dagster job execute  -f packages/pipeline/pipeline/repository.py -d packages/pipeline

build:
	cd packages/site && yarn build

format:
	cd packages/pipeline && black pipeline pipeline_tests
	cd packages/site && yarn run format

dagit:
	dagit -f packages/pipeline/pipeline/repository.py -d packages/pipeline

.PHONY: format clean update
