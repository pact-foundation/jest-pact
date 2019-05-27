#!/bin/bash

set -o pipefail
ts-node src/examples/publisher/publish.ts | grep -v Created 