
SRC = lib/json-validate.js

TESTS = test/test*.js
#REPORTER = dot
REPORTER = spec

all:
	echo "Nothing to do... I'm a Node.js module!"

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

docs: lib

.PHONY: test docs clean
