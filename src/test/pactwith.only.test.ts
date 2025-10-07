import { InteractionObject, PactV2 } from '@pact-foundation/pact';
import supertest = require('supertest');
import { pactWith } from '../index';

const getClient = (provider: PactV2) => supertest(provider.mockService.baseUrl);

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

describe('pactwith.only', () => {
  pactWith.only(
    { consumer: 'MyConsumer', provider: 'NoProvider' },
    (provider: PactV2) => {
      beforeEach(() => provider.addInteraction(postValidRequest));
      it('should only run this test', () =>
        getClient(provider)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(200));
    }
  );

  test('the test that should be skipped', () => {
    throw new Error('this test should not be run');
  });
});
