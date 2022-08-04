import { Pact } from '@pact-foundation/pact';
import { pactWith } from '../index';
import { getClient, postValidRequest } from './pactwith.test';

describe('pactwith.only', () => {
  pactWith.only(
    { consumer: 'MyConsumer', provider: 'NoProvider' },
    (provider: Pact) => {
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
