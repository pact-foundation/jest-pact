import { Pact } from '@pact-foundation/pact';
import { pactWith } from '../index';

describe('pactwith.skip', () => {
  pactWith.skip(
    { consumer: 'MyConsumer', provider: 'NoOtherProvider' },
    (_provider: Pact) => {
      test('the test that should be skipped', () => {
        throw new Error('tests inside xpactWith should not run');
      });
    }
  );
  test('this test should run', () => {});
});
