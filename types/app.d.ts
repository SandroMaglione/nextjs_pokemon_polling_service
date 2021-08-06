declare module 'app-types' {
  import('@validation/types');
  import('io-ts');
  import { TypeOf } from 'io-ts';
  import { questionDetail, pollApiRoot } from '@validation/types';

  type ErrorMessage = string;

  type QuestionDetail = TypeOf<typeof questionDetail>;
  type PollApiRoot = TypeOf<typeof pollApiRoot>;
}
