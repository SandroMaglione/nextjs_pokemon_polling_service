import { pollApiRoot, questionDetailList } from '@validation/types';
import { ErrorMessage, PollApiRoot, QuestionDetail } from 'app-types';
import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

const validateQuestionCollection = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, QuestionDetail[]> =>
  pipe(
    questionDetailList.decode(response.data),
    E.mapLeft(() => 'Error while validating question details')
  );

const validatePollApiRoot = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, PollApiRoot> =>
  pipe(
    pollApiRoot.decode(response.data),
    E.mapLeft(() => 'Error while validating pool api root')
  );

const getQuestionApiRoot = (
  url: string
): TE.TaskEither<ErrorMessage, PollApiRoot> =>
  pipe(
    TE.tryCatch(
      async () => axios.get(url),
      (error) => `Error while fetching root api at ${url}: ${error}`
    ),
    TE.chain((response) => pipe(response, validatePollApiRoot, TE.fromEither))
  );

export const getQuestionCollection = (
  url: string,
  page: number
): TE.TaskEither<ErrorMessage, QuestionDetail[]> =>
  pipe(
    getQuestionApiRoot(url),
    TE.chain(({ questions_url }) =>
      pipe(
        TE.tryCatch(
          async () =>
            axios.get(`${url}${questions_url}`, {
              params: { page },
            }),
          (error) =>
            `Error while fetching question at ${url}${questions_url}, page ${page}: ${error}`
        ),
        TE.chain((response) =>
          pipe(response, validateQuestionCollection, TE.fromEither)
        )
      )
    )
  );
