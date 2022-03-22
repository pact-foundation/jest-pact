import {
  MessageConsumerOptions,
  PactOptions,
} from '@pact-foundation/pact/dsl/options';
import { ConsumerOptions, WrapperFn, WrapperWithOnlyAndSkip } from './types';

const describeString = (options: PactOptions | MessageConsumerOptions) =>
  `Pact between ${options.consumer} and ${options.provider}`;

const describePactWith = <
  O extends ConsumerOptions,
  P,
  W extends WrapperFn<O, P>
>(
  describeFn: jest.Describe,
  wrapper: W
) => (options: O, tests: P) =>
  describeFn(describeString(options), () => wrapper(options, tests));

export const extendPactWith = <
  O extends ConsumerOptions,
  P,
  W extends WrapperFn<O, P>
>(
  wrapper: W
) => {
  const ret = describePactWith<O, P, W>(
    describe,
    wrapper
  ) as WrapperWithOnlyAndSkip<O, P>;
  ret.only = describePactWith<O, P, W>(describe.only, wrapper);
  ret.skip = describePactWith<O, P, W>(describe.skip, wrapper);
  return ret;
};
