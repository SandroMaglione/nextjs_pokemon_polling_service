import Link from 'next/link';
import { getQuestionCollection } from '@actions/actions';
import { ErrorMessage, QuestionDetail } from 'app-types';
import { pipe } from 'fp-ts/lib/function';
import { GetServerSidePropsResult } from 'next';
import { ReactElement } from 'react';
import * as E from 'fp-ts/Either';
import { map } from 'fp-ts/lib/Array';
import PageLayout from '@components/PageLayout';
import InfoText from '@components/InfoText';

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
              className="w-6 h-6"
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
                      className="px-8 py-6 bg-white shadow-md rounded-xl"
                    >
                      <h2 className="text-2xl font-black">
                        {question.question}
                      </h2>
                      <InfoText
                        label="Published"
                        text={new Date(question.published_at).toDateString()}
                      />
                      <InfoText
                        label="Choices"
                        text={`${question.choices.length}`}
                      />
                      <div className="flex flex-col gap-2 mt-6">
                        {pipe(
                          question.choices,
                          map((choice) => {
                            return (
                              <div
                                key={choice.url}
                                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-2xl"
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
