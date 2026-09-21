import { MessageConsumerPact } from '@pact-foundation/pact';

import { applyMessagePactOptionDefaults } from './internal/config';
import { extendPactWith } from './internal/scaffold';
import type { WrapperFn } from './internal/types';
import { withTimeout } from './internal/withTimeout';
import type {
  JestMessageConsumerOptions,
  JestProvidedMessagePactFn,
} from './types';

const setupMessageProvider = (
  options: JestMessageConsumerOptions,
): MessageConsumerPact => new MessageConsumerPact(options);

const jestMessagePactWrapper = (
  options: JestMessageConsumerOptions,
  tests: JestProvidedMessagePactFn,
): void => {
  withTimeout(options, () => {
    tests(setupMessageProvider(applyMessagePactOptionDefaults(options)));
  });
};

export const messagePactWith = extendPactWith<
  JestMessageConsumerOptions,
  JestProvidedMessagePactFn,
  WrapperFn<JestMessageConsumerOptions, JestProvidedMessagePactFn>
>(jestMessagePactWrapper);

export const xmessagePactWith = messagePactWith.skip;
export const fmessagePactWith = messagePactWith.only;
