import { PactfileWriteMode } from '@pact-foundation/pact';
import { LogLevel } from '@pact-foundation/pact';
import * as path from 'path';
import { JestMessageConsumerOptions, JestPactOptions } from '../types';

const logHint = (options: JestPactOptions) =>
  options.port ? `-port-${options.port}` : '';

const applyCommonDefaults = (
  options: JestPactOptions | JestMessageConsumerOptions
) => ({
  log: path.resolve(
    options.logDir ? options.logDir : path.join(process.cwd(), 'pact', 'logs'),
    options.logFileName
      ? options.logFileName
      : `${options.consumer}-${
          options.provider
        }-mockserver-interaction${logHint(options)}.log`
  ),
  dir: path.resolve(process.cwd(), 'pact/pacts'),
  logLevel: 'warn' as LogLevel,
  pactfileWriteMode: 'update' as PactfileWriteMode,
});

export const applyPactOptionDefaults = (
  options: JestPactOptions
): JestPactOptions => ({
  ...applyCommonDefaults(options),
  spec: 2,
  ...options,
});

export const applyMessagePactOptionDefaults = (
  options: JestMessageConsumerOptions
): JestMessageConsumerOptions => ({
  ...applyCommonDefaults(options),
  spec: 3,
  ...options,
});
