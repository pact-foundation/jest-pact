import { Pact } from '@pact-foundation/pact';
import { pactWith } from '../index';

describe('pactwith.only', () => {
  pactWith.only(
    { consumer: 'MyConsumer', provider: 'NoProvider' },
    (provider: Pact) => {
      it('should only run this test', () => {});
    }
  );

  test('the test that should be skipped', () => {
    throw new Error('this test should not be run');
  });
});
