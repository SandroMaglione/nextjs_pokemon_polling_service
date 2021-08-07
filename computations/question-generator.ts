import { CreateQuestion, Pokemon } from 'app-types';
import * as IO from 'fp-ts/IO';
import { pipe } from 'fp-ts/lib/function';
import { randomInt } from 'fp-ts/lib/Random';

const generateChoice = (value: number): IO.IO<[number, number, number]> =>
  IO.of([value + 10, value - 1, value + 2]);

const questionAboutHeight =
  (height: number) =>
  (name: string): IO.IO<CreateQuestion> =>
    questionGeneric(name, height, (pName) => `What is the height of ${pName}?`);

const questionAboutWeight =
  (weight: number) =>
  (name: string): IO.IO<CreateQuestion> =>
    questionGeneric(name, weight, (pName) => `What is the weight of ${pName}?`);

const questionAboutHP =
  (hp: number) =>
  (name: string): IO.IO<CreateQuestion> =>
    questionGeneric(name, hp, (pName) => `What is the base HP of ${pName}?`);

const questionGeneric = (
  name: string,
  value: number,
  question: (name: string) => string
): IO.IO<CreateQuestion> =>
  pipe(
    generateChoice(value),
    IO.map(
      ([c1, c2, c3]): CreateQuestion => ({
        question: question(name),
        choices: [`${c1}`, `${c2}`, `${c3}`, `${value}`],
      })
    )
  );

export const generateQuestion = ({
  name,
  height,
  weight,
  base_experience,
}: Pokemon): IO.IO<CreateQuestion> =>
  pipe(
    randomInt(1, 3),
    IO.chain((rand) =>
      pipe(
        name,
        rand === 1
          ? questionAboutHeight(height)
          : rand === 2
          ? questionAboutWeight(weight)
          : questionAboutHP(base_experience)
      )
    )
  );
