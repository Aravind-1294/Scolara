'use client'

import { useState, useRef, useEffect } from 'react'

interface CreateExamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (examData: ExamData) => void
  examCount?: number
}

export interface ExamData {
  questionType: string
  topics: string
  difficultyLevel: string
  numQuestions: string
}

const CreateExamModal = ({ isOpen, onClose, onSubmit, examCount = 0 }: CreateExamModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<ExamData>({
    questionType: 'mcq', // Default value
    topics: '',
    difficultyLevel: '',
    numQuestions: '5' // Default value
  })
  const [errors, setErrors] = useState<Partial<ExamData>>({})

  const FREE_TIER_DAILY_LIMIT = 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (examCount >= FREE_TIER_DAILY_LIMIT) {
    const resetTime = new Date();
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);
    const timeUntilReset = resetTime.getTime() - new Date().getTime();
    const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Daily Limit Reached</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have reached the maximum number of exams ({FREE_TIER_DAILY_LIMIT}) allowed per day in the free tier.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your limit will reset in {hoursUntilReset}h {minutesUntilReset}m.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Partial<ExamData> = {}

    if (!formData.questionType) {
      newErrors.questionType = 'Question type is required'
    }
    if (!formData.topics) {
      newErrors.topics = 'Topics are required'
    }
    if (!formData.difficultyLevel) {
      newErrors.difficultyLevel = 'Difficulty level is required'
    }
    if (!formData.numQuestions) {
      newErrors.numQuestions = 'Number of questions is required'
    } else {
      const num = parseInt(formData.numQuestions)
      if (num < 5 || num > 15) {
        newErrors.numQuestions = 'Number of questions must be between 5 and 15'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      onClose()
      setFormData({
        questionType: 'mcq',
        topics: '',
        difficultyLevel: '',
        numQuestions: '5'
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof ExamData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Exam</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Type <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 
                       text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                       focus:border-transparent outline-none"
              required
            >
              <option value="mcq">MCQs</option>
              <option value="true-false" disabled>True/False (Coming Soon)</option>
              <option value="fill-blanks" disabled>Fill in the Blanks (Coming Soon)</option>
              <option value="short-answer" disabled>Short Answers (Coming Soon)</option>
              <option value="long-answer" disabled>Long Answers (Coming Soon)</option>
            </select>
            {errors.questionType && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.questionType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topics <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 
                       text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                       focus:border-transparent outline-none
                       placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter topics"
              required
            />
            {errors.topics && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.topics}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty Level <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 
                       text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                       focus:border-transparent outline-none"
              required
            >
              <option value="">Select difficulty level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="expert">Expert</option>
            </select>
            {errors.difficultyLevel && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.difficultyLevel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Questions <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="number"
              name="numQuestions"
              value={formData.numQuestions}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 
                       text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                       focus:border-transparent outline-none"
              min="5"
              max="15"
              required
            />
            {errors.numQuestions && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.numQuestions}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md 
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateExamModal