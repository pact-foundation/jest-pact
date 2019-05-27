dir=$(PWD)/stubs

wiremock_run:
	docker run -it --rm -p 8080:8080 -v $(dir):/home/wiremock wiremock-stub --verbose

wiremock_build:
	docker build -t wiremock-stub .

wiremock_tag:
	docker tag wiremock-stub you54f/wiremock-stub

wiremock_push:
	docker push you54f/wiremock-stub