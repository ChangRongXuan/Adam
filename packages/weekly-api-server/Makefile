P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build - Transpile jsx, es6 and above to es5 files"

build-lib:
	@echo "$(P) Transpile es6, jsx and (typescript) to es5"
	NODE_ENV=production yarn babel src --out-dir lib --copy-files

dev-server:
	@echo "$(P) Start dev server"
	NODE_ENV=development yarn babel-node src/server

dev:
	yarn nodemon --exec make dev-server

start: build-lib
	@echo "$(P) Start production server"
	NODE_ENV=production node lib/server

build: clean build-lib

lint:
	@echo "$(p) Start linting"
	yarn eslint src --fix

clean:
	@echo "$(P) Clean lib/ dist/"
	rm -rf lib/ dist/

.PHONY: build clean build-lib
