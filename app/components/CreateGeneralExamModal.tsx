'use client'

import { useState } from 'react'

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
  const [formData, setFormData] = useState<ExamData>({
    questionType: '',
    topics: '',
    difficultyLevel: '',
    numQuestions: ''
  })
  const [errors, setErrors] = useState<Partial<ExamData>>({})

  const FREE_TIER_DAILY_LIMIT = 5;

  if (examCount >= FREE_TIER_DAILY_LIMIT) {
    const resetTime = new Date();
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);
    const timeUntilReset = resetTime.getTime() - new Date().getTime();
    const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Daily Limit Reached</h2>
          <p className="text-gray-600 mb-4">
            You have reached the maximum number of exams ({FREE_TIER_DAILY_LIMIT}) allowed per day in the free tier.
          </p>
          <p className="text-gray-600 mb-4">
            Your limit will reset in {hoursUntilReset}h {minutesUntilReset}m.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        questionType: '',
        topics: '',
        difficultyLevel: '',
        numQuestions: ''
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Exam</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type <span className="text-red-500">*</span>
            </label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              required
            >
              <option value="">Select question type</option>
              <option value="objective">Objective</option>
              <option value="descriptive">Descriptive</option>
            </select>
            {errors.questionType && (
              <p className="text-red-500 text-sm mt-1">{errors.questionType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              placeholder="Enter topics"
              required
            />
            {errors.topics && (
              <p className="text-red-500 text-sm mt-1">{errors.topics}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              required
            >
              <option value="">Select difficulty level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="expert">Expert</option>
            </select>
            {errors.difficultyLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numQuestions"
              value={formData.numQuestions}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              min="5"
              max="15"
              required
            />
            {errors.numQuestions && (
              <p className="text-red-500 text-sm mt-1">{errors.numQuestions}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateExamModal