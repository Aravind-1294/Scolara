export interface ExamResult {
  id: string;
  exam_title: string;
  score: number;
  total_questions: number;
  created_at: string;
  exam_data: unknown;
  user_answers: {
    objective: { [key: number]: string };
    descriptive: { [key: number]: string };
  };
} 