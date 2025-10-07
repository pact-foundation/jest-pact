import {
  MatchersV2,
  MessageConsumerPact,
  synchronousBodyHandler,
} from '@pact-foundation/pact';
import { AnyJson } from '@pact-foundation/pact/src/common/jsonTypes';
import { messagePactWith } from '../index';

interface Dog {
  id: number;
  name: string;
  type: 'bulldog' | 'sheepdog';
}

function dogApiHandler(dog: Dog): void {
  if (!dog.id && !dog.name && !dog.type) {
    throw new Error('missing fields');
  }
}
const { like, term } = MatchersV2;

const arbitraryPact = (provider: MessageConsumerPact) => {
  describe('receive dog event', () => {
    it('accepts a valid dog', () =>
      provider
        .given('some state')
        .expectsToReceive('a request for a dog')
        .withContent({
          id: like(1),
          name: like('rover'),
          type: term({
            generate: 'bulldog',
            matcher: '^(bulldog|sheepdog)$',
          }),
        })
        .withMetadata({
          'content-type': 'application/json',
        })
        .verify(
          synchronousBodyHandler(
            (dogApiHandler as unknown) as (body: AnyJson | Buffer) => void
          )
        ));
  });
};

describe('custom log locations', () => {
  describe('with logDir', () => {
    describe('without logFileName', () => {
      messagePactWith(
        {
          consumer: 'MyMessageConsumer',
          provider: 'messagePactWith2',
          logDir: 'pact/log/custom',
        },
        (provider: MessageConsumerPact) => {
          arbitraryPact(provider);
        }
      );
    });
    describe('with logFileName', () => {
      messagePactWith(
        {
          consumer: 'MyMessageConsumer',
          provider: 'messagePactWith2',
          logDir: 'pact/log/custom',
          logFileName: 'someLog.txt',
        },
        (provider: MessageConsumerPact) => {
          arbitraryPact(provider);
        }
      );
    });
  });
  describe('with only logFileName', () => {
    messagePactWith(
      {
        consumer: 'MyMessageConsumer',
        provider: 'messagePactWith2',
        logFileName: 'someOtherLog.txt',
      },
      (provider: MessageConsumerPact) => {
        arbitraryPact(provider);
      }
    );
  });
});
