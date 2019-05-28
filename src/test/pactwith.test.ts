import { InteractionObject } from "@pact-foundation/pact";
import * as supertest from "supertest";
import { pactWith } from "../index";

const getClient = (provider: any) => supertest(provider.mockService.baseUrl);

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
  { consumer: "MyConsumer", provider: "pactWith", port: 5001 },
  (provider: any) => {
    beforeEach(() => provider.addInteraction(postValidRequest));

    test("should be be able to hide the pact stuff behind the scenes with a port of the users choosing", () =>
      getClient(provider)
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200));
  }
);

pactWith({ consumer: "MyConsumer", provider: "pactWith2" }, (provider: any) => {
  beforeEach(() => provider.addInteraction(postValidRequest));

  test("should be ok if i dont provide a port", () =>
    getClient(provider)
      .get("/v2/pet/1845563262948980200")
      .set("api_key", "[]")
      .expect(200));
});
