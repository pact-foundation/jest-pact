pact_build:
	docker build -t pact-base -f base.Dockerfile .
pact_tag:
	docker tag pact-base you54f/pact-base
pact_push:
	docker push you54f/pact-base
copy_pacts:
	rm -rf pacts && cp -r ../../pact/pacts .