import { pactWithSuperTest } from "../lib/index";
import { InteractionObject, Pact } from "@pact-foundation/pact";
import supertest = require("supertest");

const postValidRequest: InteractionObject = {
  state: "A pet 1 exists",
  uponReceiving: "A get request to get a pet",
  willRespondWith: {
    status: 200
  },
  withRequest: {
    method: "GET",
    path: "/v2/pet/1",
    headers: { api_key: "[]" }
  }
};

pactWithSuperTest(
  { consumer: "MyConsumer", provider: "pactWithSuperTest" },
  async (pactMock: Pact, client: supertest.SuperTest<supertest.Test>) => {
    test("should accept a valid get request to get a pet", async () => {
      await pactMock.addInteraction(postValidRequest);

      await client
        .get("/v2/pet/1")
        .set("api_key", "[]")
        .expect(200);

      await pactMock.verify();
    });
  }
);
