import { pactWith } from "../index";
import { InteractionObject } from "@pact-foundation/pact";
import * as supertest from "supertest";

const pactPort: number = 5000;

const getClient = (port: number) => {
  const url = `http://localhost:${port}`;
  return supertest(url);
};

const postValidRequest: InteractionObject = {
  state: "A pet 1845563262948980200 exists",
  uponReceiving: "A get request to get a pet 1845563262948980200",
  willRespondWith: {
    status: 200
  },
  withRequest: {
    method: "GET",
    path: "/v2/pet/1845563262948980200",
    headers: { api_key: "[]" }
  }
};

pactWith(
  { consumer: "MyConsumer", provider: "pactWith", port: pactPort },
  async (provider: any) => {
    test("should be be able to hide the pact stuff behind the scenes with a port of the users choosing", async () => {
      await provider.addInteraction(postValidRequest);
      const client = getClient(pactPort);

      await client
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200);

      await provider.verify();
    });
  }
);

pactWith(
  { consumer: "MyConsumer", provider: "pactWith2" },
  async (provider: any) => {
    test("should be ok if i dont provide a port", async () => {
      await provider.addInteraction(postValidRequest);
      const client = getClient(8282);

      await client
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200);

      await provider.verify();
    });
  }
);
