import * as t from 'io-ts';

export const pollApiRoot = t.type({
  questions_url: t.string,
});

const questionChoice = t.type({
  choice: t.string,
  url: t.string,
  votes: t.number,
});

export const questionDetail = t.type({
  question: t.string,
  published_at: t.string,
  url: t.string,
  choices: t.array(questionChoice),
});

export const questionDetailList = t.array(questionDetail);

const createQuestion = t.type({
  question: t.string,
  choices: t.array(t.string),
});
