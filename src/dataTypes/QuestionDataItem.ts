import { AnswerItem } from "./AnswerItem";

export interface QuestionDataItem {
  level: number;
  questionId: number;
  questionType: string;
  questionText: string;
  answers: AnswerItem[];
}
