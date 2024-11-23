"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';

interface Question {
  question: string
  question_type: string
  difficulty?: string
  options?: string[]
  correct_option?: string
  answer?: string
  explanation?: string
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExamDisplayPage() {
  const router = useRouter()
  const [examData, setExamData] = useState<Question[] | null>(null)
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingFromDashboard, setViewingFromDashboard] = useState(false);

  useEffect(() => {
    console.log('Current examData:', examData)
    console.log('Current userAnswers:', userAnswers)
    console.log('isSubmitted:', isSubmitted)
    console.log('score:', score)
  }, [examData, userAnswers, isSubmitted, score])

  useEffect(() => {
    try {
      const storedExam = localStorage.getItem('generatedExam')
      console.log('Raw stored exam:', storedExam)

      if (!storedExam) {
        setError('No exam data found')
        return
      }

      let parsedData;
      try {
        // Try to parse the data
        parsedData = JSON.parse(storedExam)
        
        // If it's still a string (double encoded), parse again
        if (typeof parsedData === 'string') {
          try {
            parsedData = JSON.parse(parsedData)
          } catch (innerError) {
            console.error('Error parsing inner JSON:', innerError)
            // Continue with the string version if second parse fails
          }
        }
        
        console.log('Parsed data:', parsedData)

        // Validate the data structure
        if (!parsedData || typeof parsedData !== 'object') {
          throw new Error('Invalid exam data format')
        }

        // Handle both array and single object formats
        const questionsArray = Array.isArray(parsedData) ? parsedData : [parsedData]
        
        // Process and validate each question
        const processedData = questionsArray.map(question => {
          if (!question || typeof question !== 'object') {
            throw new Error('Invalid question format')
          }

          return {
            question: String(question.question || ''),
            question_type: String(question.question_type || 'mcq'),
            difficulty: String(question.difficulty || ''),
            options: Array.isArray(question.options) ? question.options.map(String) : [],
            correct_option: String(question.correct_option || ''),
            answer: String(question.answer || ''),
            explanation: String(question.explanation || '')
          }
        })

        if (processedData.length === 0) {
          throw new Error('No valid questions found in exam data')
        }

        console.log('Processed exam data:', processedData)
        setExamData(processedData)
      } catch (parseError) {
        console.error('Parse error:', parseError, 'Raw data:', storedExam)
        // Handle different types of errors
        const errorMessage = parseError instanceof Error 
          ? parseError.message 
          : typeof parseError === 'string'
            ? parseError
            : 'Failed to parse exam data';
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Error loading exam:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string'
          ? error
          : 'Failed to load exam data';
      setError(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (examData) {
      console.log('Loaded exam data:', examData)
      console.log('Question correct answers:', examData.map(q => q.correct_option))
    }
  }, [examData])

  useEffect(() => {
    // Check if we're viewing results and where we're viewing from
    const searchParams = new URLSearchParams(window.location.search);
    const isFromDashboard = searchParams.get('from') === 'dashboard';
    setViewingFromDashboard(isFromDashboard);
    
    if (searchParams.get('view') === 'results') {
      setIsSubmitted(true);
      
      // Only load saved answers if NOT viewing from dashboard
      if (!isFromDashboard) {
        const savedAnswers = localStorage.getItem('userAnswers');
        if (savedAnswers) {
          const parsed = JSON.parse(savedAnswers);
          setUserAnswers(parsed.mcq || {});
          
          // Calculate and set score only for non-dashboard views
          if (examData) {
            let correctCount = 0;
            examData.forEach((question, index) => {
              if (question.question_type === 'mcq' && question.options) {
                const userAnswer = parsed.mcq[index];
                const correctLetter = getCorrectOptionLetter(question, question.options);
                if (userAnswer === correctLetter) {
                  correctCount++;
                }
              }
            });
            setScore(correctCount);
          }
        }
      }
    }
  }, [examData]);

  const getCorrectOptionLetter = (question: Question, options: string[]): string => {
    if (!question || !question.correct_option || !options) {
      console.error('Invalid question data:', { question, options });
      return '';
    }

    try {
      // First try: direct letter match (A, B, C, D)
      if (question.correct_option.length === 1 && 
          question.correct_option >= 'A' && 
          question.correct_option <= 'D') {
        return question.correct_option;
      }

      // Second try: match with option text (ignoring A., B., etc. prefixes)
      const correctOption = question.correct_option.replace(/^[A-D]\.\s*/, '').trim();
      const correctAnswerIndex = options.findIndex(option => 
        option.replace(/^[A-D]\.\s*/, '').trim() === correctOption
      );
      
      if (correctAnswerIndex !== -1) {
        return String.fromCharCode(65 + correctAnswerIndex);
      }

      // Third try: fuzzy match (ignoring case and whitespace)
      const normalizedCorrectOption = correctOption.toLowerCase().replace(/\s+/g, '');
      const fuzzyIndex = options.findIndex(option => 
        option.replace(/^[A-D]\.\s*/, '').trim().toLowerCase().replace(/\s+/g, '') === normalizedCorrectOption
      );

      if (fuzzyIndex !== -1) {
        return String.fromCharCode(65 + fuzzyIndex);
      }

      console.error('Could not find correct answer in options:', {
        correctOption: question.correct_option,
        normalizedCorrectOption,
        options
      });
      return '';
    } catch (error) {
      console.error('Error in getCorrectOptionLetter:', error);
      return '';
    }
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return
    
    const optionLetter = String.fromCharCode(65 + optionIndex)
    
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionLetter
    }))
  }

  const handleSubmit = async () => {
    console.log('Submit button clicked');

    if (!examData || !user?.emailAddresses?.[0]?.emailAddress) {
      console.log('Missing required data:', { 
        examData: !!examData, 
        userEmail: user?.emailAddresses?.[0]?.emailAddress 
      });
      setError('Missing required data for submission');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score
      let correctCount = 0;
      examData.forEach((question, index) => {
        if (question.question_type === 'mcq' && question.options) {
          const userAnswer = userAnswers[index];
          const correctLetter = getCorrectOptionLetter(question, question.options);
          console.log('Question evaluation:', { 
            index, 
            userAnswer, 
            correctLetter, 
            isCorrect: userAnswer === correctLetter 
          });
          if (userAnswer && correctLetter && userAnswer === correctLetter) {
            correctCount++;
          }
        }
      });

      const examResultData = {
        user_email: user.emailAddresses[0].emailAddress,
        exam_title: `Test ${new Date().toLocaleDateString()}`,
        score: correctCount,
        total_questions: examData.filter(q => q.question_type === 'mcq').length,
        exam_data: examData,
        user_answers: {
          mcq: userAnswers,
        }
      };

      console.log('Saving exam data:', examResultData);

      const { data, error } = await supabase
        .from('exam_results')
        .insert([examResultData])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      // Update state after successful save
      setScore(correctCount);
      setIsSubmitted(true);
      console.log('Exam submitted successfully');

    } catch (error) {
      console.error('Error submitting exam:', error);
      setError(error instanceof Error ? error.message : 'Failed to save exam results');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_results')
          .select('*')
          .limit(1);
        
        console.log('Supabase test:', { data, error });
      } catch (error) {
        console.error('Supabase connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  // Add a helper function to check if exam has any mcq questions
  const hasMCQQuestions = (questions: Question[] | null): boolean => {
    return questions?.some(q => q.question_type === 'mcq') ?? false;
  }

  const formatQuestionText = (text: string): JSX.Element => {
    // Check if the text contains a code block
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    if (parts.length === 1) {
      // No code blocks found, return plain text
      return <p className="text-lg font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{text}</p>;
    }

    // Process text with code blocks
    const elements: JSX.Element[] = [];
    let index = 0;

    parts.forEach((part, i) => {
    if (i % 2 === 0) {
      // Regular text
      if (part.trim()) {
        elements.push(
          <p key={`text-${index}`} className="text-lg font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-4">
            {part}
          </p>
        );
      }
    } else {
      // Code block
      elements.push(
        <div key={`code-container-${index}`} className="my-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 p-1">
          <pre key={`code-${index}`} className="relative">
            <div className="absolute right-2 top-2">
              <button
                onClick={() => navigator.clipboard.writeText(part.trim())}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                title="Copy code"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <code className="block bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-blue-100 dark:border-blue-800">
              {part.trim()}
            </code>
          </pre>
        </div>
      );
    }
    index++;
  });

  return <div>{elements}</div>;
};

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isSubmitted ? 'Exam Results' : 'Exam'}
          </h1>
          {isSubmitted && !viewingFromDashboard && hasMCQQuestions(examData) && score > 0 && (
            <div className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
              Score: {score}/{examData?.filter(q => q.question_type === 'mcq').length || 0}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {examData && examData.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm font-medium px-3 py-1 rounded-full">
                    Question {questionIndex + 1}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-medium px-3 py-1 rounded-full">
                    {question.question_type.charAt(0).toUpperCase() + question.question_type.slice(1)}
                  </span>
                </div>

                {formatQuestionText(question.question)}

                {question.question_type === 'mcq' ? (
                  <>
                    <div className="space-y-3">
                      {question.options && question.options.map((option, optionIndex) => {
                        const optionLetter = String.fromCharCode(65 + optionIndex);
                        const correctLetter = question.options ? getCorrectOptionLetter(question, question.options) : '';
                        const isSelected = userAnswers[questionIndex] === optionLetter;
                        const isCorrect = optionLetter === correctLetter;
                        const isWrong = isSubmitted && isSelected && !isCorrect;

                        return (
                          <div
                            key={optionIndex}
                            onClick={() => !isSubmitted && handleAnswerSelect(questionIndex, optionIndex)}
                            className={`
                              flex items-center p-3 border rounded-lg cursor-pointer
                              ${!isSubmitted && isSelected ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700' : ''}
                              ${isSubmitted && isCorrect ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700' : ''}
                              ${isWrong ? 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700' : ''}
                              ${!isSubmitted && !isSelected ? 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600' : ''}
                              dark:border-gray-600
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`question-${questionIndex}`}
                                checked={isSelected}
                                onChange={() => {}}
                                disabled={isSubmitted}
                                className="h-4 w-4 text-blue-600 dark:text-blue-400 dark:border-gray-600 dark:bg-gray-700"
                              />
                              <span className={`
                                ${isSubmitted && isCorrect ? 'text-green-700 dark:text-green-400 font-medium' : ''}
                                ${isWrong ? 'text-red-700 dark:text-red-400' : ''}
                                ${!isSubmitted ? 'text-gray-700 dark:text-gray-300' : ''}
                              `}>
                                {optionLetter}. {option.replace(/^[A-D]\.\s*/, '')}
                              </span>
                            </div>
                            {isSubmitted && isCorrect && (
                              <svg 
                                className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {isSubmitted && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Explanation</h4>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          {!isSubmitted ? (
            <button
              onClick={async () => {
                setIsSubmitting(true);
                await handleSubmit();
                setIsSubmitting(false);
              }}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg ${
                isSubmitting 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Exam'
              )}
            </button>
          ) : (
            <>
              <Link href="/Dashboard"
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Print Results
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
