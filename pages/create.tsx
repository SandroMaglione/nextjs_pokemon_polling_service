/* eslint-disable @next/next/no-img-element */
import { ReactElement, useState } from 'react';
import PageLayout from '@components/PageLayout';
import FullPageLoading from '@components/FullPageLoading';
import { getPokemonByName, postQuestion } from '@actions/actions';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { CreateQuestion, ErrorMessage, Pokemon } from 'app-types';
import { pipe } from 'fp-ts/lib/function';
import InfoText from '@components/InfoText';
import { generateQuestion } from 'computations/question-generator';
import { map } from 'fp-ts/lib/Array';
import { SOURCE_URL } from '@utils/constants';
import { useRouter } from 'next/dist/client/router';

export default function Create(): ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pokemonName, setPokemonName] = useState<string>('');
  const [question, setQuestion] = useState<O.Option<CreateQuestion>>(O.none);
  const [pokemonState, setPokemonState] = useState<
    E.Either<ErrorMessage, Pokemon>
  >(E.left('No pokemon'));
  const onClickGetPokemon = async (): Promise<void> => {
    // setIsLoading(true);
    const pokemonEither = await getPokemonByName(pokemonName)();
    // setIsLoading(false);
    setPokemonState(pokemonEither);

    pipe(
      pokemonEither,
      E.fold(
        (error) => console.error(error),
        (pokemon) =>
          pipe(pokemon, generateQuestion, (io) => pipe(io(), O.of, setQuestion))
      )
    );
  };

  const onClickPostQuestion = async (): Promise<void> => {
    setIsLoading(true);
    const response = await pipe(
      question,
      TE.fromOption(() => 'No question to post'),
      TE.chain(postQuestion(SOURCE_URL))
    )();
    setIsLoading(false);

    if (E.isRight(response)) {
      router.replace('/');
    }
  };

  return (
    <PageLayout title="New Pokemon Pol">
      {isLoading && <FullPageLoading />}
      <div className="px-12 py-10 mt-24 bg-white shadow-md rounded-2xl">
        <div className="flex items-center gap-20">
          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="name">Pokemon name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Pokemon name or empty for random"
              className="px-6 py-5 placeholder-gray-400 bg-gray-200 border border-gray-200 rounded-xl focus:outline-none hover:border-accent focus:border-indigo-800"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
            />
          </div>
          <div className="flex-none">
            <button type="button" className="btn" onClick={onClickGetPokemon}>
              Generate Pol
            </button>
          </div>
        </div>

        <div>
          {pipe(
            pokemonState,
            E.fold(
              (error) => (
                <span className="inline-block mt-3 text-sm font-light">
                  {error}
                </span>
              ),
              (pokemonData) => (
                <div className="mt-12">
                  <div className="flex items-center gap-12 px-6 border border-gray-200 shadow rounded-2xl">
                    <div className="flex gap-6">
                      <img
                        src={pokemonData.sprites.front_default ?? ''}
                        alt={`Pokemon ${pokemonData.name}`}
                        className="w-[10rem] h-[10rem]"
                      />
                      <img
                        src={pokemonData.sprites.back_default ?? ''}
                        alt={`Pokemon ${pokemonData.name}`}
                        className="w-[10rem] h-[10rem]"
                      />
                    </div>
                    <div className="py-6">
                      <h2 className="text-4xl font-bold">{pokemonData.name}</h2>
                      <div className="mt-2">
                        <InfoText
                          label="Height"
                          text={`${pokemonData.height}`}
                        />
                        <InfoText
                          label="Weight"
                          text={`${pokemonData.weight}`}
                        />
                        <InfoText
                          label="Base experience"
                          text={`${pokemonData.base_experience}`}
                        />
                        <InfoText label="Order" text={`${pokemonData.order}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    {pipe(
                      question,
                      O.fold(
                        () => (
                          <span className="inline-block mt-3 text-sm font-light">
                            No question...
                          </span>
                        ),
                        ({ question, choices }) => (
                          <div className="mx-12 my-10">
                            <p className="text-2xl font-medium text-gray-800">
                              {question}
                            </p>
                            <div className="grid grid-cols-2 mt-4 gap-x-14 gap-y-10">
                              {pipe(
                                choices,
                                map((choice) => {
                                  return (
                                    <span
                                      key={choice}
                                      className="flex items-center justify-center p-12 text-2xl font-semibold bg-gray-200 shadow rounded-xl"
                                    >
                                      {choice}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                            <div className="flex items-center justify-center mt-20">
                              <button
                                type="button"
                                className="btn"
                                onClick={onClickPostQuestion}
                              >
                                Submit the question
                              </button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </PageLayout>
  );
}
