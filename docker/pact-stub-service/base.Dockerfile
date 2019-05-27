FROM golang AS healthcheck-builder

WORKDIR /

COPY healthcheck.go .

RUN go build healthcheck.go

FROM debian:stretch

ARG PACT_RUBY_VERSION="1.66.0"


WORKDIR /pact-ruby

RUN apt-get update && apt-get install -y curl && \
    curl -L -O https://github.com/pact-foundation/pact-ruby-standalone/releases/download/v${PACT_RUBY_VERSION}/pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz && \
    tar -xf pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz && \
    rm pact-${PACT_RUBY_VERSION}-linux-x86_64.tar.gz && \
    rm -rf /var/lib/apt/lists/*


ENV PATH="/pact-ruby/pact/bin/:${PATH}"

EXPOSE 8080
EXPOSE 8181

COPY --from=healthcheck-builder /healthcheck .
COPY ./start.sh .

CMD ["./start.sh"]
