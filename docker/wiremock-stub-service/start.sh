#! /usr/bin/env bash
set -e

echo "Starting Healthcheck..."
nohup sh -c ./healthcheck &

echo "Starting Wiremock Service..."
./docker-entrypoint.sh --verbose
