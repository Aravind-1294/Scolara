"use client"
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Image from 'next/image'
import FileUploader from './FileUploader'
import { extractText } from '../utils/textExtractor'
import CreateGeneralExamModal from './CreateGeneralExamModal'
import CreateExtractedTextExamModal from './CreateExtractedTextExamModal'
import { useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ChatDashboard from './ChatDashboard'

const CHARACTER_LIMIT = 3000;
const FREE_TIER_EXAM_LIMIT = 5;
const FREE_TIER_DAILY_LIMIT = 5;

interface GeneratedPayload {
  questionType: string
  difficultyLevel: string
  numQuestions: number
  textContent: string
}

interface ExamData {
  questionType: string
  topics: string
  difficultyLevel: string
  numQuestions: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ExamResult {
  id: string;
  exam_title: string;
  score: number;
  total_questions: number;
  created_at: string;
  question_type?: string;
}

interface DailyExamLimit {
  count: number;
  lastResetDate: string;
}

const ExamCard = ({ 
  exam, 
  onExamClick 
}: { 
  exam: ExamResult;
  onExamClick: (examId: string) => void;
}) => {
  const router = useRouter();
  const scorePercentage = (exam.score / exam.total_questions) * 100;
  const hasValidScore = !isNaN(scorePercentage);
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format the date in a consistent way that doesn't depend on user's locale
  const formattedDate = useMemo(() => {
    const date = new Date(exam.created_at);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }, [exam.created_at]);

  return (
    <div
      onClick={() => onExamClick(exam.id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {exam.exam_title}
              </h3>
              {hasValidScore ? (
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  Objective
                </span>
              ) : (
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                  Descriptive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formattedDate}
            </p>
          </div>
          {hasValidScore && (
            <div className={`font-bold text-lg ${getScoreColor(scorePercentage)}`}>
              {scorePercentage.toFixed(0)}%
            </div>
          )}
        </div>
        
        {hasValidScore && (
          <>
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    scorePercentage >= 80 ? 'bg-green-500' :
                    scorePercentage >= 60 ? 'bg-blue-500' :
                    scorePercentage >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Score: {exam.score}/{exam.total_questions}
              </span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </>
        )}

        {!hasValidScore && (
          <div className="mt-4 flex items-center justify-end text-sm">
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardProps {
  // define any props here
}

export default function Dashboard(props: DashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string>('')
  const [characterCount, setCharacterCount] = useState(0)
  const [isTextTruncated, setIsTextTruncated] = useState(false)
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false)
  const [isExtractedTextModalOpen, setIsExtractedTextModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [pastExams, setPastExams] = useState<ExamResult[]>([]);
  const [examCount, setExamCount] = useState<number>(0);
  const { user } = useUser();
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [dailyExamLimit, setDailyExamLimit] = useState<DailyExamLimit>({
    count: 0,
    lastResetDate: new Date().toDateString()
  });

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchPastExams();
      fetchExamCount();
    }
  }, [user]);

  const fetchPastExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('id, exam_title, score, total_questions, created_at')
        .eq('user_email', user?.emailAddresses?.[0]?.emailAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPastExams(data || []);
    } catch (error) {
      console.error('Error fetching past exams:', error);
    }
  };

  const fetchExamCount = async () => {
    try {
      // Get today's date at midnight
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('exam_results')
        .select('created_at')
        .eq('user_email', user?.emailAddresses?.[0]?.emailAddress)
        .gte('created_at', startOfDay.toISOString());

      if (error) throw error;

      // Update daily exam limit
      setDailyExamLimit({
        count: data.length,
        lastResetDate: startOfDay.toDateString()
      });
      setExamCount(data.length);
    } catch (error) {
      console.error('Error fetching exam count:', error);
    }
  };

  const handleExamClick = async (examId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('id', examId)
        .single();

      if (error) throw error;

      // Store the exam data in localStorage and redirect to results page
      localStorage.setItem('generatedExam', JSON.stringify(data.exam_data));
      localStorage.setItem('userAnswers', JSON.stringify(data.user_answers));
      router.push('/exam-display?view=results');
    } catch (error) {
      console.error('Error loading exam results:', error);
    }
  };

  const handleExamGeneration = async (payload: GeneratedPayload) => {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail !== 'aravindgang07@gmail.com' && examCount >= FREE_TIER_EXAM_LIMIT) {
      setError('You have reached the maximum number of exams allowed in the free tier. Please upgrade to create more exams.');
      return;
    }
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://web-production-d90d4.up.railway.app/api/generate-extracted-text-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      console.log('Raw API Response:', responseData)

      if (responseData.success) {
        // Check if responseData.data is already an object/array
        const examData = typeof responseData.data === 'string' 
          ? JSON.parse(responseData.data)
          : responseData.data;
        
        // Add question_type if not present
        const processedData = examData.map((question: any) => ({
          ...question,
          question_type: question.question_type || 'descriptive'
        }))
        
        // Store the processed data
        localStorage.setItem('generatedExam', JSON.stringify(processedData))
        
        router.push('/exam-display')
      } else {
        throw new Error(responseData.error || 'Failed to generate exam')
      }
    } catch (error) {
      console.error('Error details:', error)
      setError(error instanceof Error ? error.message : 'Failed to process exam data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateExam = async (examData: ExamData) => {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail !== 'aravindgang07@gmail.com' && examCount >= FREE_TIER_EXAM_LIMIT) {
      setError('You have reached the maximum number of exams allowed in the free tier. Please upgrade to create more exams.');
      return;
    }
    setIsLoading(true)
    setError('')

    try {
      const payload = {
        ...examData,
        numQuestions: parseInt(examData.numQuestions, 10)
      };

      const response = await fetch('https://web-production-d90d4.up.railway.app/api/generate-general-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (data.success) {
        const examData = data.data
        console.log('Exam data to store:', examData)
        
        localStorage.setItem('generatedExam', JSON.stringify(examData))
        router.push('/exam-display')
      } else {
        throw new Error(data.error || 'Failed to create exam')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      console.error('Error creating exam:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file)
    setIsExtracting(true)
    setExtractError('')
    setCharacterCount(0)
    setIsTextTruncated(false)

    try {
      const text = await extractText(file)
      const totalCharacters = text.length

      if (totalCharacters > CHARACTER_LIMIT) {
        setExtractedText(text.substring(0, CHARACTER_LIMIT))
        setIsTextTruncated(true)
        setCharacterCount(CHARACTER_LIMIT)
      } else {
        setExtractedText(text)
        setCharacterCount(totalCharacters)
      }
    } catch (error) {
      setExtractError(error instanceof Error ? error.message : 'Failed to extract text')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleCreateExamClick = () => {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail === 'aravindgang07@gmail.com') {
      setIsGeneralModalOpen(true);
    } else if (dailyExamLimit.count >= FREE_TIER_DAILY_LIMIT) {
      setShowLimitWarning(true);
    } else {
      setIsGeneralModalOpen(true);
    }
  };

  const handleGenerateExamClick = () => {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail === 'aravindgang07@gmail.com') {
      setIsExtractedTextModalOpen(true);
    } else if (dailyExamLimit.count >= FREE_TIER_DAILY_LIMIT) {
      setShowLimitWarning(true);
    } else {
      setIsExtractedTextModalOpen(true);
    }
  };

  const LimitWarningModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    const resetTime = new Date();
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);
    const timeUntilReset = resetTime.getTime() - new Date().getTime();
    const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <div className="flex items-center mb-4 text-amber-600">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Daily Limit Reached</h2>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              You have reached the maximum number of exams ({FREE_TIER_DAILY_LIMIT}) allowed per day in the free tier.
            </p>
            <p className="text-gray-600">
              Your limit will reset in {hoursUntilReset}h {minutesUntilReset}m.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="flex-1 ml-64 overflow-y-auto bg-gray-50">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Please wait while we create your exam...</p>
            </div>
          </div>
        )}

        <div className="space-y-6 p-6 my-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Tests</h1>
                  <p className="text-gray-600 mt-1">View and manage your exam results</p>
                </div>
                <button
                  onClick={handleCreateExamClick}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Exam</span>
                </button>
              </div>

              {pastExams.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tests Created Yet</h3>
                    <p className="text-gray-500 mb-6">
                      Start by creating your first exam to track your progress
                    </p>
                    <button
                      onClick={() => setIsGeneralModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Exam
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastExams.map((exam) => (
                    <ExamCard 
                      key={exam.id} 
                      exam={exam} 
                      onExamClick={handleExamClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Extract Text from File</h1>
                  <p className="text-gray-600 mt-1">Upload a document to create custom exam questions from its content</p>
                </div>
                <button
                  onClick={handleGenerateExamClick}
                  disabled={!extractedText || isLoading}
                  className={`${
                    !extractedText || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-6 py-3 rounded-lg font-medium transition-colors`}
                >
                  Create Exam
                </button>
              </div>

              {examCount >= FREE_TIER_EXAM_LIMIT && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>You have reached the maximum number of exams allowed in the free tier. Please upgrade to create more exams.</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="max-w-xl mx-auto">
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>

                  {uploadedFile && (
                    <div className="max-w-xl mx-auto mt-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 mr-3">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        {isExtracting && (
                          <div className="ml-4">
                            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {extractError && (
                    <div className="max-w-xl mx-auto">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{extractError}</p>
                      </div>
                    </div>
                  )}

                  {extractedText && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Extracted Text
                        </h3>
                        <button
                          onClick={() => navigator.clipboard.writeText(extractedText)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Copy to clipboard</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 pb-2">
                        <span>Characters: {characterCount}</span>
                        {isTextTruncated && (
                          <span className="text-amber-600">
                            * Text truncated to {CHARACTER_LIMIT} characters
                          </span>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {extractedText}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && <ChatDashboard />}

          <LimitWarningModal 
            isOpen={showLimitWarning} 
            onClose={() => setShowLimitWarning(false)} 
          />

          <CreateGeneralExamModal
            isOpen={isGeneralModalOpen}
            onClose={() => setIsGeneralModalOpen(false)}
            onSubmit={handleCreateExam}
          />

          <CreateExtractedTextExamModal
            isOpen={isExtractedTextModalOpen}
            onClose={() => setIsExtractedTextModalOpen(false)}
            extractedText={extractedText}
            onGenerate={handleExamGeneration}
          />
        </div>
      </main>
    </div>
  )
}