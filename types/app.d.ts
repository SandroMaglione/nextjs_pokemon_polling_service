declare module 'app-types' {
  import('@validation/poll');
  import('@validation/pokemon');
  import('io-ts');
  import { TypeOf } from 'io-ts';
  import {
    questionDetail,
    pollApiRoot,
    createQuestion,
  } from '@validation/poll';
  import { pokemon } from '@validation/pokemon';

  type ErrorMessage = string;

  type QuestionDetail = TypeOf<typeof questionDetail>;
  type PollApiRoot = TypeOf<typeof pollApiRoot>;
  type CreateQuestion = TypeOf<typeof createQuestion>;

  type Pokemon = TypeOf<typeof pokemon>;
}
