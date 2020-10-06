import { V3MockServer } from '@pact-foundation/pact/v3/pact';
import * as supertest from 'supertest';
import { pactWith } from './index';

const getClient = (mock: V3MockServer) => supertest(mock.url);

pactWith({ consumer: 'MyConsumer', provider: 'pactWith v3' }, (interaction) => {
  interaction('pact integration', ({ provider, execute }) => {
    beforeEach(() =>
      provider
        .given('A pet 1845563262948980200 exists')
        .uponReceiving('A get request to get a pet 1845563262948980200')
        .withRequest({
          method: 'GET',
          path: '/v2/pet/1845563262948980200',
          headers: { api_key: '[]' },
        })
        .willRespondWith({
          status: 200,
        }),
    );

    execute('A pact test that returns 200', (mock) =>
      getClient(mock)
        .get('/v2/pet/1845563262948980200')
        .set('api_key', '[]')
        .expect(200),
    );
  });

  interaction('another pact integration', ({ provider, execute }) => {
    beforeEach(() =>
      provider
        .given('No pets exist')
        .uponReceiving('A get request to get a pet 1845563262948980200')
        .withRequest({
          method: 'GET',
          path: '/v2/pet/1845563262948980200',
          headers: { api_key: '[]' },
        })
        .willRespondWith({
          status: 404,
        }),
    );

    execute('A pact test that returns 404', (mock) =>
      getClient(mock)
        .get('/v2/pet/1845563262948980200')
        .set('api_key', '[]')
        .expect(404),
    );
  });
});
