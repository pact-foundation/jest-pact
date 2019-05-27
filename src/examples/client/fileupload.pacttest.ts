import { InteractionObject } from "@pact-foundation/pact";
import { like, term } from "@pact-foundation/pact/dsl/matchers";
import { readFileSync } from "fs";
import * as jestpact from "jest-pact";

const port = 9880;

jestpact.pactWithSuperTest(
  { consumer: "test-consumer", provider: "file-upload-provider", port },
  async (provider: any, client: any) => {
    describe("file upload service", () => {
      test("should successfully allow upload of a base 64 encoded pdf", async () => {
        const pdfname: string = "test-base64.pdf";
        const pdf = readFileSync(pdfname);
        const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving:
            "a well formed request with a base 64 encoded pdf to upload",
          withRequest: {
            method: "POST",
            path: "/upload",
            headers: {
              "Content-Type": term({
                generate:
                  "multipart/form-data; boundary=--------------------------560782525175769486914756",
                matcher:
                  "multipart/form-data; boundary=--------------------------[0-9]{24}"
              }),
              Authorization: term({
                generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
                matcher: "Bearer [0-9A-z]{24}"
              }),
              "Content-Length": like("299")
            },
            body
          },
          willRespondWith: {
            headers: {
              "Content-Type": "application/json"
            },
            status: 201
          }
        };

        await provider.addInteraction(interaction);

        await client
          .post("/upload")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
          .field("test", "test")
          .attach("document", pdfname)
          .expect(201);
      });
      test("should successfully allow upload of binary encoded pdf", async () => {
        const pdfname: string = "test.pdf";
        const pdf = readFileSync(pdfname);
        const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving:
            "a well formed request with a binary encoded pdf to upload",
          withRequest: {
            method: "POST",
            path: "/upload",
            headers: {
              "Content-Type": term({
                generate:
                  "multipart/form-data; boundary=--------------------------560782525175769486914756",
                matcher:
                  "multipart/form-data; boundary=--------------------------[0-9]{24}"
              }),
              Authorization: term({
                generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
                matcher: "Bearer [0-9A-z]{24}"
              }),
              "Content-Length": like("299")
            },
            body
          },
          willRespondWith: {
            headers: {
              "Content-Type": "application/json"
            },
            status: 201
          }
        };

        await provider.addInteraction(interaction);

        await client
          .post("/upload")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
          .field("test", "test")
          .attach("document", pdfname)
          .expect(201);
      });
    });
  }
);

// const getClient = () => {
//   const url = `http://localhost:${pactPort}`;
//   return supertest(url);
// };

// describe("File Upload service provider pact", () => {
//   beforeAll(async () => await provider.setup());
//   afterEach(async () => await provider.verify());
//   afterAll(async () => await provider.finalize());

//   describe("file upload service", () => {
//     test("should successfully allow upload of a base 64 encoded pdf", async () => {
//       const pdfname: string = "test-base64.pdf";
//       const pdf = readFileSync(pdfname);
//       const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
//       const interaction: InteractionObject = {
//         state: "Service is up and healthy",
//         uponReceiving:
//           "a well formed request with a base 64 encoded pdf to upload",
//         withRequest: {
//           method: "POST",
//           path: "/upload",
//           headers: {
//             "Content-Type": term({
//               generate:
//                 "multipart/form-data; boundary=--------------------------560782525175769486914756",
//               matcher:
//                 "multipart/form-data; boundary=--------------------------[0-9]{24}"
//             }),
//             Authorization: term({
//               generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
//               matcher: "Bearer [0-9A-z]{24}"
//             }),
//             "Content-Length": like("299")
//           },
//           body
//         },
//         willRespondWith: {
//           headers: {
//             "Content-Type": "application/json"
//           },
//           status: 201
//         }
//       };

//       await provider.addInteraction(interaction);

//       const client = getClient();
//       await client
//         .post("/upload")
//         .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
//         .field("test", "test")
//         .attach("document", pdfname)
//         .expect(201);
//     });
//     test("should successfully allow upload of binary encoded pdf", async () => {
//       const pdfname: string = "test.pdf";
//       const pdf = readFileSync(pdfname);
//       const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
//       const interaction: InteractionObject = {
//         state: "Service is up and healthy",
//         uponReceiving:
//           "a well formed request with a binary encoded pdf to upload",
//         withRequest: {
//           method: "POST",
//           path: "/upload",
//           headers: {
//             "Content-Type": term({
//               generate:
//                 "multipart/form-data; boundary=--------------------------560782525175769486914756",
//               matcher:
//                 "multipart/form-data; boundary=--------------------------[0-9]{24}"
//             }),
//             Authorization: term({
//               generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
//               matcher: "Bearer [0-9A-z]{24}"
//             }),
//             "Content-Length": like("299")
//           },
//           body
//         },
//         willRespondWith: {
//           headers: {
//             "Content-Type": "application/json"
//           },
//           status: 201
//         }
//       };

//       await provider.addInteraction(interaction);

//       const client = getClient();
//       await client
//         .post("/upload")
//         .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
//         .field("test", "test")
//         .attach("document", pdfname)
//         .expect(201);
//     });
//   });

// });

// const pactPort = 9880;
// const provider = getProvider({
//   pactPort,
//   provider: "file-upload-provider"
// });

// const getClient = () => {
//   const url = `http://localhost:${pactPort}`;
//   return supertest(url);
// };

// describe("File Upload service provider pact", () => {
//   beforeAll(async () => await provider.setup());
//   afterEach(async () => await provider.verify());
//   afterAll(async () => await provider.finalize());

//   describe("file upload service", () => {
//     test("should successfully allow upload of a base 64 encoded pdf", async () => {
//       const pdfname: string = "test-base64.pdf";
//       const pdf = readFileSync(pdfname);
//       const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
//       const interaction: InteractionObject = {
//         state: "Service is up and healthy",
//         uponReceiving:
//           "a well formed request with a base 64 encoded pdf to upload",
//         withRequest: {
//           method: "POST",
//           path: "/upload",
//           headers: {
//             "Content-Type": term({
//               generate:
//                 "multipart/form-data; boundary=--------------------------560782525175769486914756",
//               matcher:
//                 "multipart/form-data; boundary=--------------------------[0-9]{24}"
//             }),
//             Authorization: term({
//               generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
//               matcher: "Bearer [0-9A-z]{24}"
//             }),
//             "Content-Length": like("299")
//           },
//           body
//         },
//         willRespondWith: {
//           headers: {
//             "Content-Type": "application/json"
//           },
//           status: 201
//         }
//       };

//       await provider.addInteraction(interaction);

//       const client = getClient();
//       await client
//         .post("/upload")
//         .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
//         .field("test", "test")
//         .attach("document", pdfname)
//         .expect(201);
//     });
//     test("should successfully allow upload of binary encoded pdf", async () => {
//       const pdfname: string = "test.pdf";
//       const pdf = readFileSync(pdfname);
//       const body = `----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"test\"\r\n\r\ntest\r\n----------------------------713166514119664968500586\r\nContent-Disposition: form-data; name=\"document\"; filename=\"${pdfname}\"\r\nContent-Type: application/pdf\r\n\r\n${pdf}\r\n----------------------------713166514119664968500586--\r\n`;
//       const interaction: InteractionObject = {
//         state: "Service is up and healthy",
//         uponReceiving:
//           "a well formed request with a binary encoded pdf to upload",
//         withRequest: {
//           method: "POST",
//           path: "/upload",
//           headers: {
//             "Content-Type": term({
//               generate:
//                 "multipart/form-data; boundary=--------------------------560782525175769486914756",
//               matcher:
//                 "multipart/form-data; boundary=--------------------------[0-9]{24}"
//             }),
//             Authorization: term({
//               generate: "Bearer eyJhbGciOiJIUzI1NiIXVCJ9",
//               matcher: "Bearer [0-9A-z]{24}"
//             }),
//             "Content-Length": like("299")
//           },
//           body
//         },
//         willRespondWith: {
//           headers: {
//             "Content-Type": "application/json"
//           },
//           status: 201
//         }
//       };

//       await provider.addInteraction(interaction);

//       const client = getClient();
//       await client
//         .post("/upload")
//         .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIXVCJ9")
//         .field("test", "test")
//         .attach("document", pdfname)
//         .expect(201);
//     });
//   });
// });
