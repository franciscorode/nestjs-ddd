###############################
###          HELP           ###
###############################

.PHONY: help

help:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'



###############################
###    LOCAL DEVELOPMENT    ###
###############################

install:
	yarn install

lint:
	yarn lint

format:
	yarn format

type-check:
	yarn tsc --noEmit

audit:
	yarn audit

clean:
	rm -rf src/dist
	rm -rf coverage
	rm -rf src/coverage
	rm -rf yarn-error.log
	rm -rf tests/src/coverage
	rm -rf tests/src/node_modules

start:
	yarn run start

start-dev:
	yarn run start:dev

start-prod:
	yarn run start:prod

build:
	rm -rf src/dist
	yarn run build

test-unit:
	yarn run test

test-cov:
	yarn run test:cov

e2e:
	yarn run test:e2e

upgrade-deps:
	yarn upgrade
	# run `yarn upgrade --latest` to ignore ranges specified in packcage.json

