import { InteractionObject, Pact } from '@pact-foundation/pact';
import * as supertest from 'supertest';
import { getProviderBaseUrl, pactWith } from '../index';

const getClient = (provider: Pact) => supertest(provider.mockService.baseUrl);
const pactPort: number = 5001;

const postValidRequest: InteractionObject = {
  state: 'A pet 1845563262948980200 exists',
  uponReceiving: 'A get request to get a pet 1845563262948980200',
  willRespondWith: {
    status: 200,
  },
  withRequest: {
    method: 'GET',
    path: '/v2/pet/1845563262948980200',
    headers: { api_key: '[]' },
  },
};

pactWith(
  { consumer: 'MyConsumer', provider: 'pactWith', port: pactPort },
  (provider: Pact) => {
    describe('pact integration', () => {
      beforeEach(() => provider.addInteraction(postValidRequest));

      test('should be be able to hide the pact stuff behind the scenes with a port of the users choosing', () =>
        getClient(provider)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(200));
    });

    describe('provider object', () => {
      test('should show the specified port in the URL', () => {
        expect(provider.mockService.baseUrl).toMatch(
          new RegExp(`${pactPort}$`),
        );
      });
      test('should return the port on getProviderBaseUrl', () => {
        expect(getProviderBaseUrl(provider)).toEqual(
          `http://127.0.0.1:${pactPort}`,
        );
      });
    });
  },
);

pactWith(
  { consumer: 'MyConsumer', provider: 'pactWith2' },
  (provider: Pact) => {
    describe('pact integration', () => {
      beforeEach(() => provider.addInteraction(postValidRequest));

      test('should be ok if i dont provide a port', () =>
        getClient(provider)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(200));
    });

    describe('provider object', () => {
      test('should show the randomly assigned port in the URL', () => {
        expect(provider.mockService.baseUrl).toMatch(new RegExp(`\\d{4,5}$`));
      });

      test('should return the host on getProviderBaseUrl', () => {
        expect(getProviderBaseUrl(provider)).toMatch(
          new RegExp('^http://127.0.0.1:\\d{4,5}$'),
        );
      });
    });
  },
);

describe('custom log locations', () => {
  const arbitraryPact = (provider: Pact) => {
    describe('pact test', () => {
      beforeEach(() => provider.addInteraction(postValidRequest));

      test('works', () =>
        getClient(provider)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(200));
    });
  };

  describe('with logDir', () => {
    describe('without logFileName', () => {
      pactWith(
        {
          consumer: 'MyConsumer',
          provider: 'pactWith2',
          logDir: 'pact/log/custom',
        },
        (provider: Pact) => {
          arbitraryPact(provider);
        },
      );
    });
    describe('with logFileName', () => {
      pactWith(
        {
          consumer: 'MyConsumer',
          provider: 'pactWith2',
          logDir: 'pact/log/custom',
          logFileName: 'someLog.txt',
        },
        (provider: Pact) => {
          arbitraryPact(provider);
        },
      );
    });
  });
  describe('with only logFileName', () => {
    pactWith(
      {
        consumer: 'MyConsumer',
        provider: 'pactWith2',
        logFileName: 'someOtherLog.txt',
      },
      (provider: Pact) => {
        arbitraryPact(provider);
      },
    );
  });
});
