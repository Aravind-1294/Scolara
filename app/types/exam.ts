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

  export interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
  }
  
  export interface ExtractedResult {
    text: string;
    metadata?: Record<string, unknown>;
  } 