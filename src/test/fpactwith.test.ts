import { fpactWith } from '../index';

describe('fpactwith', () => {
  fpactWith(
    { consumer: 'MyConsumer', provider: 'NoProvider' },
    (provider: any) => {
      it('should only run this test', () => {});
    },
  );

  test('the test that should be skipped', () => {
    throw new Error('this test should not be run');
  });
});
