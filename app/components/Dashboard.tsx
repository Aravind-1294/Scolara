"use client"
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import FileUploader from './FileUploader'
import { extractText } from '../utils/textExtractor'
import CreateGeneralExamModal from './CreateGeneralExamModal'
import CreateExtractedTextExamModal from './CreateExtractedTextExamModal'
import { useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ChatDashboard from './ChatDashboard'
import { Toggle } from "../components/ui/toggle"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"

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

interface ExamQuestion {
  question_type?: string;
  [key: string]: any;  // Allows for other properties
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group"
    >
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base group-hover:text-blue-600 transition-colors">
                {exam.exam_title}
              </h3>
              {hasValidScore ? (
                <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full w-fit">
                  MCQs
                </span>
              ) : (
                <span className="inline-block px-2 py-1 bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full w-fit">
                  Descriptive
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
          {hasValidScore && (
            <div className={`font-bold text-base md:text-lg ${getScoreColor(scorePercentage)}`}>
              {scorePercentage.toFixed(0)}%
            </div>
          )}
        </div>
        
        {hasValidScore && (
          <>
            <div className="mt-3 md:mt-4">
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    scorePercentage >= 80 ? 'bg-green-500' :
                    scorePercentage >= 60 ? 'bg-blue-500' :
                    scorePercentage >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-3 md:mt-4 flex items-center justify-between text-xs md:text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Score: {exam.score}/{exam.total_questions}
              </span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                View Details
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </>
        )}

        {!hasValidScore && (
          <div className="mt-3 md:mt-4 flex items-center justify-end text-xs md:text-sm">
            <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
              View Details
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  // Add required props here
  userId?: string;
  // If truly no props are needed, you can remove the interface entirely
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('general');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [lastTab, setLastTab] = useState<string | null>(null);
  const router = useRouter()
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
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const fetchPastExams = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')  // Select all fields to ensure we have complete data
        .eq('user_email', user?.emailAddresses?.[0]?.emailAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Validate the data before setting it
      const validExams = (data || []).filter(exam => 
        exam && 
        typeof exam.score === 'number' && 
        typeof exam.total_questions === 'number' &&
        exam.total_questions > 0 &&
        exam.exam_title &&
        exam.created_at
      );
      
      setPastExams(validExams);
    } catch (error) {
      console.error('Error fetching past exams:', error);
      setError('Failed to fetch exam data');
    }
  }, [user?.emailAddresses]);

  const fetchExamCount = useCallback(async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('exam_results')
        .select('created_at')
        .eq('user_email', user?.emailAddresses?.[0]?.emailAddress)
        .gte('created_at', startOfDay.toISOString());

      if (error) throw error;

      setDailyExamLimit({
        count: data.length,
        lastResetDate: startOfDay.toDateString()
      });
      setExamCount(data.length);
    } catch (error) {
      console.error('Error fetching exam count:', error);
    }
  }, [user?.emailAddresses]);

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchExamCount();
      fetchPastExams();
    }
  }, [user, fetchExamCount, fetchPastExams]);

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
        const processedData = examData.map((question: ExamQuestion) => ({
          ...question,
          question_type: question.question_type || 'mcq'
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
          <div className="flex items-center mb-4 text-amber-600">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Limit Reached</h2>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have reached the maximum number of exams ({FREE_TIER_DAILY_LIMIT}) allowed per day in the free tier.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Your limit will reset in {hoursUntilReset}h {minutesUntilReset}m.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const calculateAnalytics = useMemo(() => {
    try {
      if (!pastExams || pastExams.length === 0) {
        return {
          totalExams: 0,
          averagePercentage: "0.0",
          chartData: []
        };
      }

      // Filter exams based on time period
      const now = new Date();
      const filteredExams = timeFilter === 'all' ? pastExams : pastExams.filter(exam => {
        const examDate = new Date(exam.created_at);
        switch (timeFilter) {
          case 'today':
            return examDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return examDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return examDate >= monthAgo;
          default:
            return true;
        }
      });

      const totalExams = filteredExams.length;
      if (totalExams === 0) {
        return {
          totalExams: 0,
          averagePercentage: "0.0",
          chartData: []
        };
      }

      const totalPercentage = filteredExams.reduce((sum, exam) => {
        const score = (exam.score / exam.total_questions) * 100;
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      
      const averagePercentage = (totalPercentage / totalExams).toFixed(1);

      const chartData = filteredExams.map(exam => ({
        name: new Date(exam.created_at).toLocaleDateString(),
        total: Number(((exam.score / exam.total_questions) * 100).toFixed(1))
      }));

      return {
        totalExams,
        averagePercentage,
        chartData
      };
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return {
        totalExams: 0,
        averagePercentage: "0.0",
        chartData: []
      };
    }
  }, [pastExams, timeFilter]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.tab) {
        setActiveTab(event.state.tab);
      } else if (activeTab !== 'general') {
        // If there's no state and we're not on general, go to general first
        event.preventDefault();
        setActiveTab('general');
        window.history.pushState({ tab: 'general' }, '', window.location.pathname);
      } else {
        // If we're on general, let the default navigation happen (to landing page)
        router.push('/');
      }
    };

    // Initial history state
    if (activeTab !== 'general') {
      window.history.replaceState({ tab: activeTab }, '', window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab, router]);

  // Update history when tab changes
  useEffect(() => {
    if (activeTab !== lastTab) {
      if (activeTab !== 'general') {
        window.history.pushState({ tab: activeTab }, '', window.location.pathname);
      }
      setLastTab(activeTab);
    }
  }, [activeTab, lastTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full md:w-64 md:fixed md:inset-y-0 z-40">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          dailyExamLimit={dailyExamLimit}
        />
      </div>

      <main className="flex-1 w-full md:ml-64">
        <div className="min-h-screen pb-20 md:pb-0">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg text-center max-w-[90%] md:max-w-md mx-auto">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 dark:border-blue-700 mx-auto"></div>
                <p className="mt-4 text-sm md:text-base text-gray-700 dark:text-gray-300">Please wait while we create your exam...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-3 sm:mx-4 md:mx-6 mt-3 sm:mt-4 md:mt-6">
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base">
                {error}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="p-3 sm:p-4 md:p-6 space-y-4 mt-16 md:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Performance</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and analyze your exam results</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleCreateExamClick}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 dark:from-blue-700 to-blue-700 dark:to-blue-800 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Exam
                  </button>
                  <Toggle
                    pressed={showAnalytics}
                    onPressedChange={setShowAnalytics}
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-700 data-[state=on]:bg-blue-500 dark:data-[state=on]:bg-blue-700 data-[state=on]:text-white px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center"
                  >
                    {showAnalytics ? 'View History' : 'View Analytics'}
                  </Toggle>
                </div>
              </div>
              {showAnalytics ? (
                <div className="w-full p-2 sm:p-4 md:p-6">
                  <Card className="w-full">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Performance Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setTimeFilter('all')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            timeFilter === 'all'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          Total Exams
                        </button>
                        <button
                          onClick={() => setTimeFilter('month')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            timeFilter === 'month'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setTimeFilter('week')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            timeFilter === 'week'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setTimeFilter('today')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            timeFilter === 'today'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          Today
                        </button>
                      </div>
                      <div className="h-[250px] sm:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={calculateAnalytics?.chartData || []} margin={{ 
                            top: 20, 
                            right: 10, 
                            left: 0, 
                            bottom: 20 
                          }}>
                            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                            <XAxis 
                              dataKey="name" 
                              tick={false}
                              axisLine={{ stroke: '#E5E7EB' }}
                            />
                            <YAxis 
                              tick={{ 
                                fill: 'currentColor',
                                fontSize: window.innerWidth < 640 ? 10 : 12 
                              }}
                              domain={[0, 100]}
                              label={{ 
                                value: 'Score (%)', 
                                angle: -90,
                                position: 'insideLeft',
                                style: {
                                  fill: 'currentColor',
                                  textAnchor: 'middle',
                                }
                              }}
                              className="text-gray-600 dark:text-gray-300"
                            />
                            <Tooltip 
                              cursor={false}
                              contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px'
                              }}
                              labelStyle={{ color: 'white' }}
                              itemStyle={{ color: 'white' }}
                            />
                            <Bar dataKey="total">
                              {(calculateAnalytics?.chartData || []).map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`}
                                  fill={entry.total >= 80 ? '#22c55e' : 
                                        entry.total >= 60 ? '#3b82f6' : 
                                        entry.total >= 40 ? '#eab308' : 
                                        '#ef4444'}
                                  className="dark:opacity-80"
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2 sm:p-4">
                    <Card className="bg-gradient-to-br from-blue-500 dark:from-blue-700 to-blue-600 dark:to-blue-800 text-white transform hover:scale-105 transition-transform duration-200">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg font-medium opacity-80">Total Exams Taken</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl sm:text-4xl font-bold">{calculateAnalytics?.totalExams || 0}</span>
                          <span className="text-sm sm:text-base text-blue-100 dark:text-blue-300">exams</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 dark:from-purple-700 to-purple-600 dark:to-purple-800 text-white transform hover:scale-105 transition-transform duration-200">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg font-medium opacity-80">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl sm:text-4xl font-bold">{calculateAnalytics?.averagePercentage || 0}</span>
                          <span className="text-sm sm:text-base text-purple-100 dark:text-purple-300">%</span>
                        </div>
                        <p className="text-xs sm:text-sm text-purple-100 dark:text-purple-300 mt-2">Overall performance</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 dark:from-emerald-700 to-emerald-600 dark:to-emerald-800 text-white transform hover:scale-105 transition-transform duration-200">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg font-medium opacity-80">Latest Score</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl sm:text-4xl font-bold">
                            {pastExams[0] ? ((pastExams[0].score / pastExams[0].total_questions) * 100).toFixed(1) : 0}
                          </span>
                          <span className="text-sm sm:text-base text-emerald-100 dark:text-emerald-300">%</span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-100 dark:text-emerald-300 mt-2">Most recent exam</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2 sm:p-4">
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
            <div className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6 mt-16 md:mt-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Extract Text from File</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Upload a document to create custom exam questions from its content</p>
                </div>
                <button
                  onClick={handleGenerateExamClick}
                  disabled={!extractedText || isLoading}
                  className={`${
                    !extractedText || isLoading
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 dark:from-blue-700 to-blue-700 dark:to-blue-800 hover:shadow-lg transform hover:scale-105'
                  } text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Exam
                    </>
                  )}
                </button>
              </div>

              {examCount >= FREE_TIER_EXAM_LIMIT && (
                <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-400 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>You have reached the maximum number of exams allowed in the free tier. Please upgrade to create more exams.</p>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="max-w-xl mx-auto">
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>

                  {uploadedFile && (
                    <div className="max-w-xl mx-auto mt-4">
                      <div className="flex items-center p-2 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex-shrink-0 mr-2 md:mr-3">
                          <svg className="h-5 w-5 md:h-6 md:w-6 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        {isExtracting && (
                          <div className="ml-4">
                            <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth={4}
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {extractError && (
                    <div className="max-w-xl mx-auto">
                      <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                        <p className="text-red-600 dark:text-red-300 text-sm md:text-base">{extractError}</p>
                      </div>
                    </div>
                  )}

                  {extractedText && (
                    <div className="mt-3 sm:mt-4 md:mt-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                          Extracted Text
                        </h3>
                        <button
                          onClick={() => navigator.clipboard.writeText(extractedText)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 text-sm font-medium flex items-center space-x-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Copy to clipboard</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pb-2">
                        <span>Characters: {characterCount}</span>
                        {isTextTruncated && (
                          <span className="text-amber-600 dark:text-amber-400">
                            * Text truncated to {CHARACTER_LIMIT} characters
                          </span>
                        )}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-[calc(100vh-20rem)] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
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