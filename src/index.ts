import * as pact from "@pact-foundation/pact";
import * as path from "path";
import * as supertest from "supertest";

export interface PactOptions {
  provider: string;
  consumer: string;
  port?: number;
  logLevel?: LogLevel;
  pactfileWriteMode?: PactFileWriteMode;
}

export declare type LogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export declare type PactFileWriteMode = "overwrite" | "update" | "merge";

export const pactWith = (options: PactOptions, tests: any) =>
  describe(`Pact between ${options.consumer} and ${options.provider}`, () => {
    const port: number = options.port || 8282;
    const pactMock: pact.Pact = new pact.Pact({
      port,
      log: path.resolve(
        process.cwd(),
        "pact/logs",
        `${options.consumer}-${options.provider}-mockserver-integration.log`
      ),
      dir: path.resolve(process.cwd(), "pact/pacts"),
      spec: 2,
      logLevel: options.logLevel || "error",
      pactfileWriteMode: options.pactfileWriteMode || "update",
      ...options
    });

    beforeAll(() => pactMock.setup());
    afterAll(() => pactMock.finalize());
    afterEach(() => pactMock.verify());

    tests(pactMock);
  });

export const pactWithSuperTest = (options: PactOptions, tests: any) =>
  describe(`Pact between ${options.consumer} and ${options.provider}`, () => {
    const port = options.port || 8989;
    const pactMock: pact.Pact = new pact.Pact({
      port,
      log: path.resolve(
        process.cwd(),
        "pact/logs",
        `${options.consumer}-${options.provider}-mockserver-integration.log`
      ),
      dir: path.resolve(process.cwd(), "pact/pacts"),
      spec: 2,
      logLevel: options.logLevel || "error",
      pactfileWriteMode: options.pactfileWriteMode || "update",
      ...options
    });

    beforeAll(() => pactMock.setup());
    afterAll(() => pactMock.finalize());
    afterEach(() => pactMock.verify());

    const client: supertest.SuperTest<supertest.Test> = getClient(port);

    tests(pactMock, client);
  });

const getClient = (port: number) => {
  const url = `http://localhost:${port}`;
  return supertest(url);
};
