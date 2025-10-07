import { PactV2 } from '@pact-foundation/pact';
import { xpactWith } from '../index';

describe('xpactwith', () => {
  xpactWith(
    { consumer: 'MyConsumer', provider: 'NoOtherProvider' },
    (_provider: PactV2) => {
      test('the test that should be skipped', () => {
        throw new Error('tests inside xpactWith should not run');
      });
    }
  );
  test('this test should run', () => {});
});
