import rules from "./data/rules.json";
import questionsData from "./data/questionsData.json";
import levels from "./data/levels.json";
import answersData from "./data/correctAnswersData.json";
import { Level } from "./dataTypes/Level";
import { QuestionDataItem } from "./dataTypes/QuestionDataItem";
import { CorrectAnswerDataItem } from "./dataTypes/CorrectAnswerDataItem";

/**
 * Loads the Rules.json into an array
 * @returns and array of rules.
 */
export const getRules = () => rules;

/**
 * Returns an array of exam questions for a level.
 * @param level
 * @returns all the exam questions for selected level.
 */
export const getExamData = (level: number): QuestionDataItem[] => {
  let data = questionsData.filter(
    (d) => d.level === level
  ) as QuestionDataItem[];
  return data;
};

/** Returns an array of levels. */
export function getLevels(): Level[] {
  return levels as Level[];
}

/** Returns the array of answers for all questions. */
export const getAnswersData = (): CorrectAnswerDataItem[] =>
  answersData as CorrectAnswerDataItem[];
