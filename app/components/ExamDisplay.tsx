// components/ExamDisplay.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Question {
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  marks?: number;
}

interface ExamDisplayProps {
  questions: Question[];
}

const ExamDisplay = ({ questions }: ExamDisplayProps) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;
    
    questions.forEach((question, index) => {
      const marks = question.marks || 1; // Default 1 mark if not specified
      totalMarks += marks;
      
      if (answers[index]?.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()) {
        correctAnswers++;
        obtainedMarks += marks;
      }
    });
    
    return {
      correctAnswers,
      totalQuestions: questions.length,
      obtainedMarks,
      totalMarks,
      percentage: (obtainedMarks / totalMarks) * 100
    };
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const score = showResults ? calculateScore() : null;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Generated Exam</h1>
        {showResults && score && (
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">Questions</div>
              <div className="text-xl font-bold">{score.correctAnswers}/{score.totalQuestions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">Marks</div>
              <div className="text-xl font-bold">{score.obtainedMarks}/{score.totalMarks}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">Percentage</div>
              <div className={`text-xl font-bold ${getScoreColor(score.percentage)}`}>
                {score.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={showResults ? { opacity: 0, y: 20 } : false}
            animate={showResults ? { opacity: 1, y: 0 } : false}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <h3 className="font-medium mb-4 text-gray-900">
              Question {index + 1}: {question.question}
            </h3>
            
            <div className="mt-4">
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your answer here..."
                disabled={showResults}
              />
            </div>
            
            {showResults && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="mt-4 space-y-4"
              >
                <div className={`p-4 rounded-lg border ${
                  answers[index]?.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Your Answer:</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      answers[index]?.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {answers[index]?.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
                        ? 'Correct'
                        : 'Incorrect'
                      }
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {answers[index] || 'No answer provided'}
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Correct Answer:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {question.correct_answer}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {!showResults && (
        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Submit Answers
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ExamDisplay;