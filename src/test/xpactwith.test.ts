import { Pact } from '@pact-foundation/pact';
import { xpactWith } from '../index';

describe('xpactwith', () => {
  xpactWith(
    { consumer: 'MyConsumer', provider: 'NoOtherProvider' },
    (provider: Pact) => {
      test('the test that should be skipped', () => {
        throw new Error('tests inside xpactWith should not run');
      });
    }
  );
  test('this test should run', () => {});
});
