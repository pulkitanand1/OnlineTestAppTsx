import rules from "./data/rules.json";
import questionsData from "./data/questionsData.json";
import levels from "./data/levels.json";
import answersData from "./data/correctAnswersData.json";
import { Level } from "./dataTypes/Level";
import { QuestionDataItem } from "./dataTypes/QuestionDataItem";
import { CorrectAnswerDataItem } from "./dataTypes/CorrectAnswerDataItem";

export const getRules = () => rules;

export const getExamData = (level: number): QuestionDataItem[] => {
  let data = questionsData.filter(
    (d) => d.level === level
  ) as QuestionDataItem[];
  return data;
};

export function getLevels(): Level[] {
  return levels as Level[];
}

export const getAnswersData = (): CorrectAnswerDataItem[] =>
  answersData as CorrectAnswerDataItem[];
