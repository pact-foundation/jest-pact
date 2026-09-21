import type {
  MessageConsumerOptions,
  MessageConsumerPact,
  PactV2,
  PactV2Options,
} from '@pact-foundation/pact';
import type { WrapperWithOnlyAndSkip } from './internal/types';

interface ExtraOptions {
  timeout?: number;
  logDir?: string;
  logFileName?: string;
}

export type JestPactOptions = PactV2Options & ExtraOptions;

export type JestMessageConsumerOptions = MessageConsumerOptions & ExtraOptions;

export type JestProvidedPactFn = (provider: PactV2) => void;

export type JestProvidedMessagePactFn = (
  messagePact: MessageConsumerPact,
) => void;

export type PactWith = WrapperWithOnlyAndSkip<
  JestPactOptions,
  JestProvidedPactFn
>;

export type MessagePactWith = WrapperWithOnlyAndSkip<
  JestMessageConsumerOptions,
  JestProvidedMessagePactFn
>;
