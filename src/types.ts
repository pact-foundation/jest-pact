import { MessageConsumerPact, Pact } from '@pact-foundation/pact';
import {
  MessageConsumerOptions,
  PactOptions,
} from '@pact-foundation/pact/dsl/options';
import { WrapperWithOnlyAndSkip } from './internal/types';

interface ExtraOptions {
  timeout?: number;
  logDir?: string;
  logFileName?: string;
}

export type JestPactOptions = PactOptions & ExtraOptions;

export type JestMessageConsumerOptions = MessageConsumerOptions & ExtraOptions;

export type JestProvidedPactFn = (provider: Pact) => void;

export type JestProvidedMessagePactFn = (
  messagePact: MessageConsumerPact
) => void;

export type PactWith = WrapperWithOnlyAndSkip<
  JestPactOptions,
  JestProvidedPactFn
>;

export type MessagePactWith = WrapperWithOnlyAndSkip<
  JestMessageConsumerOptions,
  JestProvidedMessagePactFn
>;
