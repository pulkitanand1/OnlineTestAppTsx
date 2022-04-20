import * as dp from "./DataProvider";
import { AnswerMatrixItem } from "./dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "./dataTypes/QuestionDataItem";

interface EvaluationItem {
  level: number;
  questionTest: string;
  answeredCorrectly: boolean;
  userAnswers: string[];
  correctAnswers: string[];
}

export const finishAndEvaluateTest = (
  answerMatrix: AnswerMatrixItem[],
  questionsData: QuestionDataItem[],
  registrationData: any
) => {
  const answersData = dp.getAnswersData();
  let answersEvaluatonData = answerMatrix.map((am) => {
    // Fetching the correct answer Ids
    let correctAnswerIds: number[] = getCorrectAnswerForQuestion(
      am.level,
      am.questionId
    );

    let qText = questionsData.find(
      (q) => q.level === am.level && q.questionId === am.questionId
    )?.questionText;

    let evaluationItem: EvaluationItem = {
      level: am.level,
      questionTest: qText ? qText : "",
      answeredCorrectly: false,
      userAnswers: [],
      correctAnswers: [],
    };

    let userAnswers: string[] = getAnswersTextForQuestion(
      am.level,
      am.questionId,
      am.selectedAnswerIds
    );

    if (userAnswers) evaluationItem.userAnswers = userAnswers;

    if (correctAnswerIds) {
      correctAnswerIds.forEach((caid: number) => {
        // If any of the answers are missing, it means the answer was wrong.
        if (
          correctAnswerIds &&
          (am.selectedAnswerIds.length !== correctAnswerIds.length ||
            !am.selectedAnswerIds.includes(caid))
        ) {
          evaluationItem.answeredCorrectly = false;
          // Need to fetch as the answers differ
          let correctAnswers = getAnswersTextForQuestion(
            am.level,
            am.questionId,
            correctAnswerIds
          );
          evaluationItem.correctAnswers = correctAnswers;
        } else {
          evaluationItem.answeredCorrectly = true;
          // Correct answers would already match the text, no need to perform the fetch.
          evaluationItem.correctAnswers = evaluationItem.userAnswers;
        }
      });
    }
    // New array with evaluation item has been created.
    return evaluationItem;
  });

  const finalData = {
    registrationData: registrationData,
    answersData: answersEvaluatonData,
  };
  const json = JSON.stringify(finalData, null, 2);
  const url = window.URL.createObjectURL(
    new Blob([json], { type: "application/json" })
  );
  return url;

  function getCorrectAnswerForQuestion(
    level: number,
    questionId: number
  ): number[] {
    let answerKeyItem = answersData.find(
      (ad) => ad.level === level && ad.questionId === questionId
    );
    return answerKeyItem ? answerKeyItem.correctAnswerIds : [];
  }

  function getAnswersTextForQuestion(
    level: number,
    questionId: number,
    answerIds: number[]
  ): string[] {
    let question = questionsData.find(
      (ad) => ad.level === level && ad.questionId === questionId
    );
    let answers = question?.answers
      .filter((sa) => answerIds.includes(sa.answerId))
      .map((sa) => sa.answerText);
    return answers ? answers : [];
  }
};
