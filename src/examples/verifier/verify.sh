#!/bin/bash
set -o pipefail

  AWS_TEMP_CREDS=`aws sts assume-role --role-arn $ARN_ROLE --role-session-name api-gateway-access| jq -c '.Credentials'`
  export AWS_ACCESS_KEY_ID=`echo $AWS_TEMP_CREDS | jq -r '.AccessKeyId'`
  export AWS_SECRET_ACCESS_KEY=`echo $AWS_TEMP_CREDS | jq -r '.SecretAccessKey'`
  export AWS_SESSION_TOKEN=`echo $AWS_TEMP_CREDS | jq -r '.SessionToken'`

npx ts-node src/examples/verifier/verify.ts | grep -v Created
