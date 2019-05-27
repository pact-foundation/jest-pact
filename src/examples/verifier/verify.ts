"use strict";

import { Verifier, VerifierOptions } from "@pact-foundation/pact";
import { LogLevel } from "@pact-foundation/pact/dsl/options";
import * as aws4 from "aws4";
import * as cp from "child_process";
import * as supertest from "supertest";
import url = require("url");

let revision: string;
let artefactTag: string = "";
let branch: string;
let publishResultsFlag: boolean = false;
let tagsArray: string[];

try {
  revision = cp
    .execSync("git rev-parse --short HEAD", { stdio: "pipe" })
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError(
    "Couldn't find a git commit hash, is this a git directory?"
  );
}

try {
  artefactTag = cp
    .execSync("git describe", { stdio: "pipe" })
    .toString()
    .trim();
} catch (Error) {
  const errorMessage = Error.message;
  if (errorMessage.indexOf("fatal") >= 0) {
    if (process.env.CIRCLE_BUILD_NUM) {
      artefactTag = process.env.CIRCLE_BUILD_NUM;
    } else {
      throw new TypeError("Couldn't find a git tag or CIRCLE_BUILD_NUM");
    }
  }
}

try {
  branch = cp
    .execSync("git rev-parse --abbrev-ref HEAD", { stdio: "pipe" })
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError("Couldn't find a git branch, is this a git directory?");
}

const providerVersion = artefactTag + "-" + revision;

if (!process.env.PACT_CONSUMER_TAG) {
  tagsArray = [branch];
} else {
  const tags = process.env.PACT_CONSUMER_TAG.replace(/ /g, "");
  const tagsSlashEncoded = tags.replace(/\//g, "%2F");
  tagsArray = tagsSlashEncoded.split(",");
}

if (
  process.env.PACT_PUBLISH_VERIFICATION &&
  process.env.PACT_PUBLISH_VERIFICATION === "true"
) {
  publishResultsFlag = true;
}
let signedHost: string;
let signedXAmzSecurityToken: string;
let signedXAmzDate: string;
let signedAuthorization: string;
let authHeaders: any;

const opts: VerifierOptions = {
  stateHandlers: {
    "A pet 1845563262948980200 exists": async () => {
      const requestUrl = process.env.PACT_PROVIDER_URL;
      const pet = "1845563262948980200";
      const object = {
        id: pet,
        category: {
          id: pet,
          name: "string"
        },
        name: "doggie",
        photoUrls: ["string"],
        tags: [
          {
            id: 0,
            name: "string"
          }
        ],
        status: "available"
      };
      const res = await supertest(requestUrl)
        .post(`/v2/pet`)
        .send(object)
        .set("api_key", "[]")
        .expect(200);
      return Promise.resolve(res);
    },
    "Is authenticated": async () => {
      const requestUrl = process.env.PACT_PROVIDER_URL || "";
      const host = new url.URL(requestUrl).host;
      const apiroute = new url.URL(requestUrl).pathname;
      const pathname = `${apiroute}/helloworld`;
      const options = {
        host,
        path: pathname,
        headers: {}
      };
      await aws4.sign(options);
      aws4.sign(options, {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        sessionToken: process.env.AWS_SESSION_TOKEN
      });
      authHeaders = options.headers;
      signedHost = authHeaders.Host;
      signedXAmzSecurityToken = authHeaders["X-Amz-Security-Token"];
      signedXAmzDate = authHeaders["X-Amz-Date"];
      signedAuthorization = authHeaders.Authorization;
      return Promise.resolve(`AWS signed headers created`);
    },
    "Is not authenticated": async () => {
      signedHost = "null";
      signedXAmzSecurityToken = "null";
      signedXAmzDate = "null";
      signedAuthorization = "null";
      return Promise.resolve(`Blank aws headers created`);
    }
  },
  requestFilter: (req, res, next) => {
    // over-riding request headers with AWS credentials
    if (signedXAmzSecurityToken && signedXAmzSecurityToken !== "null") {
      req.headers.Host = signedHost;
      req.headers["X-Amz-Security-Token"] = signedXAmzSecurityToken;
      req.headers["X-Amz-Date"] = signedXAmzDate;
      req.headers.Authorization = signedAuthorization;
    }
    next();
  },
  provider: process.env.PACT_PROVIDER_NAME, // where your service will be running during the test, either staging or localhost on CI
  providerBaseUrl: process.env.PACT_PROVIDER_URL || "", // where your service will be running during the test, either staging or localhost on CI
  pactBrokerUrl: process.env.PACT_BROKER_URL,
  publishVerificationResult: publishResultsFlag || false, // ONLY SET THIS TRUE IN CI!
  validateSSL: true,
  changeOrigin: true,
  providerVersion, // the application version of the provider
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  tags: tagsArray,
  logLevel: "error" as LogLevel
};

new Verifier(opts)
  .verifyProvider()
  .then(() => {
    // tslint:disable-next-line: no-console
    console.log("successfully verified pacts");
    process.exit(0);
  })
  .catch((error: any) => {
    // tslint:disable-next-line: no-console
    console.log(error);
    process.exit(1);
  });
