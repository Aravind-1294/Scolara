// components/ExamDisplay.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

interface ExamDisplayProps {
  questions: Question[];
}

const ExamDisplay = ({ questions }: ExamDisplayProps) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  console.log('Questions in ExamDisplay:', questions); // Debug log

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Generated Exam</h1>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-medium mb-4">
              Question {index + 1}: {question.question}
            </h3>
            
            {/* Always show textarea since these are descriptive questions */}
            <div className="mt-4">
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your answer here..."
              />
            </div>
            
            {showResults && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Your Answer:</h4>
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify({ answer: answers[index] || '' }, null, 2)}
                  </pre>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Question Details:</h4>
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify({
                      question: question.question,
                      question_type: 'descriptive',
                      difficulty: question.difficulty
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamDisplay;