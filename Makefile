DATA_DIR := data/db/*

all: pull

clean:
	rm -f ${DATA_DIR}

pull:
	dagster job execute  -f packages/pipeline/pipeline/repository.py -d packages/pipeline

format:
	cd packages/pipeline && black pipeline pipeline_tests
	cd packages/site && yarn run format

.PHONY: format clean
