import { AnswerMatrixItem } from "../../dataTypes/AnswerMatrixItem";
import { CorrectAnswerDataItem } from "../../dataTypes/CorrectAnswerDataItem";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";
import * as dp from "../APIs/DataAPI";

export interface EvaluationItem {
  level: number;
  questionTest: string;
  answeredCorrectly: boolean;
  userAnswers: string[];
  correctAnswers: string[];
}

/**
 * Evaluates Answer Matrix (user responses) and returns the final test result
 * @param answerMatrix
 * @param questionsData
 * @returns
 */
export const finishAndEvaluateTest = (
  answerMatrix: AnswerMatrixItem[],
  questionsData: QuestionDataItem[]
) => {
  const answersData = dp.getAnswersDataByLevel(answerMatrix[0].level);
  let answersEvaluatonData = answerMatrix.map((am) => {
    // Fetching the correct answer Ids
    let correctAnswerIds: number[] = getCorrectAnswerForQuestion(
      am.level,
      am.questionId,
      answersData
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
      am.selectedAnswerIds,
      questionsData
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
            correctAnswerIds,
            questionsData
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

  return answersEvaluatonData;
};

/**
 * To generate a download link for Json File.
 * @param registrationData
 * @param answersEvaluatonData
 * @returns
 */
export const generateJSONDownloadUrl = (
  registrationData: any,
  answersEvaluatonData: EvaluationItem[]
) => {
  const finalData = {
    registrationData: registrationData,
    answersData: answersEvaluatonData,
  };
  const json = JSON.stringify(finalData, null, 2);
  const url = window.URL.createObjectURL(
    new Blob([json], { type: "application/json" })
  );
  return url;
};

/**
 * Returns the correct answer Ids for a questionId and level.
 * @param level
 * @param questionId
 * @param answersData
 * @returns
 */
function getCorrectAnswerForQuestion(
  level: number,
  questionId: number,
  answersData: CorrectAnswerDataItem[]
): number[] {
  let answerKeyItem = answersData.find(
    (ad) => ad.level === level && ad.questionId === questionId
  );
  return answerKeyItem ? answerKeyItem.correctAnswerIds : [];
}

/**
 * Returns Answer test for Question
 * @param level
 * @param questionId
 * @param answerIds
 * @param questionsData
 * @returns
 */
function getAnswersTextForQuestion(
  level: number,
  questionId: number,
  answerIds: number[],
  questionsData: QuestionDataItem[]
): string[] {
  let question = questionsData.find(
    (ad) => ad.level === level && ad.questionId === questionId
  );
  let answers = question?.answers
    .filter((sa) => answerIds.includes(sa.answerId))
    .map((sa) => sa.answerText);
  return answers ? answers : [];
}
