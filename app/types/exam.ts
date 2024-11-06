export interface ExamQuestion {
    correct_option: string;
    explanation: string;
    options: string[];
    question: string;
    question_type: string;
  }
  
  export interface ExamData {
    count: number;
    questions: ExamQuestion[];
    status: string;
  }