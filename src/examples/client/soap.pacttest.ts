import { InteractionObject } from "@pact-foundation/pact";
import * as fs from "fs";
import * as jestpact from "jest-pact";

const port = 5100;

// http://www.soapclient.com/xml/soapresponder.wsdl
const requestPath = "/xml/soapresponder.wsdl";
const resumeRequest = fs.readFileSync(
  "./src/examples/client/data/Resume_Request.xml",
  "utf-8"
);
const resumeResponse = fs.readFileSync(
  "./src/examples/client/data/Resume_Response.xml",
  "utf-8"
);

jestpact.pactWithSuperTest(
  { consumer: "test-consumer", provider: "soap-provider", port },
  async (provider: any, client: any) => {
    describe("Simple Soap Request", () => {
      it("should add two numbers", async () => {
        const interaction: InteractionObject = {
          state: "Any",
          uponReceiving: "a simple soap request",
          withRequest: {
            method: "POST",
            path: requestPath,
            body: resumeRequest,
            headers: {
              "Content-Type": "text/xml;charset=UTF-8"
            }
          },
          willRespondWith: {
            body: resumeResponse,
            headers: {
              "Content-Type": "text/xml;charset=UTF-8"
            },
            status: 200
          }
        };

        await provider.addInteraction(interaction);

        await client
          .post(requestPath)
          .set("Content-Type", "text/xml;charset=UTF-8")
          .send(resumeRequest)
          .expect(200, resumeResponse);
      });
    });
  }
);
