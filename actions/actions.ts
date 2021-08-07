import {
  pollApiRoot,
  questionDetail,
  questionDetailList,
} from '@validation/poll';
import {
  CreateQuestion,
  ErrorMessage,
  Pokemon,
  PollApiRoot,
  QuestionDetail,
} from 'app-types';
import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as IO from 'fp-ts/IO';
import { pokemon } from '@validation/pokemon';
import { randomInt } from 'fp-ts/lib/Random';

const validateQuestionCollection = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, QuestionDetail[]> =>
  pipe(
    questionDetailList.decode(response.data),
    E.mapLeft(() => 'Error while validating question details')
  );

const validateQuestion = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, QuestionDetail> =>
  pipe(
    questionDetail.decode(response.data),
    E.mapLeft(() => 'Error while validating question details')
  );

const validatePollApiRoot = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, PollApiRoot> =>
  pipe(
    pollApiRoot.decode(response.data),
    E.mapLeft(() => 'Error while validating pool api root')
  );

const validatePokemon = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, Pokemon> =>
  pipe(
    pokemon.decode(response.data),
    E.mapLeft(() => 'Error while validating pokemon')
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

const getPokemonByNameRequest = (
  name: string
): TE.TaskEither<ErrorMessage, Pokemon> =>
  pipe(
    TE.tryCatch(
      async () =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`),
      (error) => `Error while fetching pokemon ${name}: ${error}`
    ),
    TE.chain((response) => pipe(response, validatePokemon, TE.fromEither))
  );

const getRandomPokemon = (
  randomGenerator: IO.IO<number>
): TE.TaskEither<ErrorMessage, Pokemon> =>
  pipe(
    randomGenerator,
    TE.fromIO,
    TE.chain((rand) =>
      TE.tryCatch(
        async () => axios.get(`https://pokeapi.co/api/v2/pokemon/${rand}`),
        (error) => `Error while fetching random pokemon: ${error}`
      )
    ),
    TE.chain((response) => pipe(response, validatePokemon, TE.fromEither))
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

export const getPokemonByName = (
  name: string
): TE.TaskEither<ErrorMessage, Pokemon> =>
  pipe(
    name,
    O.fromPredicate((pokemonName) => pokemonName.length > 0),
    O.fold(
      () => getRandomPokemon(randomInt(1, 780)),
      (pokemonName) =>
        pipe(
          getPokemonByNameRequest(pokemonName),
          TE.orElse(() => getRandomPokemon(randomInt(1, 780)))
        )
    )
  );

export const postQuestion =
  (url: string) =>
  (question: CreateQuestion): TE.TaskEither<ErrorMessage, QuestionDetail> =>
    pipe(
      getQuestionApiRoot(url),
      TE.chain(({ questions_url }) =>
        pipe(
          TE.tryCatch(
            async () => axios.post(`${url}${questions_url}`, question),
            (error) =>
              `Error while posting question at ${url}${questions_url}: ${error}`
          ),
          TE.chain((response) =>
            pipe(response, validateQuestion, TE.fromEither)
          )
        )
      )
    );
