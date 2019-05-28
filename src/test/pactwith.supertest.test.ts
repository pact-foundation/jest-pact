import { InteractionObject, Pact } from "@pact-foundation/pact";
import supertest = require("supertest");
import { pactWithSuperTest } from "../index";

const pactPort: number = 8283;

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
  { consumer: "MyConsumer", provider: "pactWithSuperTest", port: pactPort },
  (pactMock: Pact, client: supertest.SuperTest<supertest.Test>) => {
    beforeEach(() => pactMock.addInteraction(postValidRequest));

    test("should accept a valid get request to get a pet", () =>
      client
        .get("/v2/pet/1")
        .set("api_key", "[]")
        .expect(200));
  }
);
