import rules from "./mockData/rules.json";
import questionsData from "./mockData/questionsData.json";
import levels from "./mockData/levels.json";
import answersData from "./mockData/correctAnswersData.json";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";
import { Level } from "../../dataTypes/Level";
import { CorrectAnswerDataItem } from "../../dataTypes/CorrectAnswerDataItem";
import { RuleItem } from "../../dataTypes/RuleItem";

/**
 * Loads the Rules.json into an array
 * @returns and array of rules.
 */
export const getRules = (): RuleItem[] => rules;

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
export const getAnswersDataByLevel = (level: number): CorrectAnswerDataItem[] =>
  answersData as CorrectAnswerDataItem[];
