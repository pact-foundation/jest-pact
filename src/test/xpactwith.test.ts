import { xpactWith } from '../index';

describe('xpactwith', () => {
  xpactWith(
    { consumer: 'MyConsumer', provider: 'NoOtherProvider' },
    (provider: any) => {
      test('the test that should be skipped', () => {
        throw new Error('tests inside xpactWith should not run');
      });
    },
  );
  test('this test should run', () => {});
});
