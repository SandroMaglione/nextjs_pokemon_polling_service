import Link from 'next/link';
import { getQuestionCollection } from '@actions/actions';
import { ErrorMessage, QuestionDetail } from 'app-types';
import { pipe } from 'fp-ts/lib/function';
import { GetServerSidePropsResult } from 'next';
import { ReactElement } from 'react';
import * as E from 'fp-ts/Either';
import { map } from 'fp-ts/lib/Array';
import PageLayout from '@components/PageLayout';

interface PageProps {
  questionList: E.Either<ErrorMessage, QuestionDetail[]>;
}

export default function Home({ questionList }: PageProps): ReactElement {
  return (
    <PageLayout title="PokePol">
      <div className="flex items-center justify-center pt-12 pb-20">
        <Link href="/create">
          <a className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Pokemon Pol
          </a>
        </Link>
      </div>
      {pipe(
        questionList,
        E.fold(
          (error) => <span>{error}</span>,
          (list) => (
            <div className="grid grid-cols-3 gap-24">
              {pipe(
                list,
                map((question) => {
                  return (
                    <div
                      key={question.url}
                      className="bg-white shadow-md rounded-xl px-8 py-6"
                    >
                      <h2 className="font-black text-2xl">
                        {question.question}
                      </h2>
                      <p className="text-sm text-gray-800 mt-6">
                        <span className="font-medium">Published: </span>
                        <span className="font-light">
                          {question.published_at}
                        </span>
                      </p>
                      <p className="text-sm text-gray-800 mt-1s">
                        <span className="font-medium">Choices: </span>
                        <span className="font-light">
                          {question.choices.length}
                        </span>
                      </p>
                      <div className="mt-6 flex-col flex gap-2">
                        {pipe(
                          question.choices,
                          map((choice) => {
                            return (
                              <div
                                key={choice.url}
                                className="flex items-center bg-gray-50 px-4 py-2 rounded-2xl justify-between"
                              >
                                <p className="font-light">{choice.choice}</p>
                                <p className="text-xs font-black text-gray-700">
                                  {choice.votes}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )
        )
      )}
    </PageLayout>
  );
}

const SOURCE_URL = 'https://polls.apiblueprint.org';

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<PageProps>
> {
  return pipe(
    await getQuestionCollection(SOURCE_URL, 1)(),
    (either): GetServerSidePropsResult<PageProps> => ({
      props: {
        questionList: either,
      },
    })
  );
}
