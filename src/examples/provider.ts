import * as pact from "@pact-foundation/pact";
import * as path from "path";

interface PactProviderOptions {
  provider: string;
  pactPort: number;
}

export const getProvider = ({ pactPort, provider }: PactProviderOptions) => {
  return new pact.Pact({
    consumer: "test-consumer", // current service at hand, it makes it easier to know who would be broken by the change in the provider when we test the contract.
    dir: path.resolve(__dirname, "../../pacts"), // path to the files where the pact should be saved
    log: path.resolve(
      __dirname,
      "../../logs",
      `${provider}-expectation-integration.log`
    ), // path to the file where logs should be stored
    logLevel: "error", // one of 'TRACE', 'DEBUG', 'INFO', 'ERROR', 'FATAL' OR 'WARN'
    port: pactPort, // where the mock service should be listening
    provider, // required, so we know who will need to verify the pact
    spec: 2, // the pact specification we are using
    pactfileWriteMode: "update"
  });
};
