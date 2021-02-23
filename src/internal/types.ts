export interface ConsumerOptions {
  consumer: string;
  provider: string;
}

export type WrapperFn<O extends ConsumerOptions, P> = (o: O, p: P) => void;

export interface WrapperWithOnlyAndSkip<O extends ConsumerOptions, P>
  extends WrapperFn<O, P> {
  only: WrapperFn<O, P>;
  skip: WrapperFn<O, P>;
}
