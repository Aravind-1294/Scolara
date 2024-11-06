'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreateExtractedTextExamModalProps {
  isOpen: boolean
  onClose: () => void
  extractedText: string
  onGenerate: (payload: any) => void
  examCount?: number
}

interface FormData {
  title: string;
  content: string;
  // add other form fields as needed
}

const FREE_TIER_DAILY_LIMIT = 5;

// Replace 'any' with a proper type
type ExtractedTextData = {
  text: string;
  // Add other properties as needed
};

const CreateExtractedTextExamModal = ({ 
  isOpen, 
  onClose, 
  extractedText,
  onGenerate,
  examCount = 0 
}: CreateExtractedTextExamModalProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title) {
      newErrors.title = 'Title is required'
    }
    if (!formData.content) {
      newErrors.content = 'Content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const payload = {
        title: formData.title,
        content: formData.content,
        // add other form fields as needed
      }

      try {
        onGenerate(payload)
        onClose()
      } catch (error) {
        console.error('Error generating questions:', error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Generate Questions from Text</h2>
        <p className="text-gray-600 text-sm mb-6">
          Create customized questions from your uploaded text. Select the question type, difficulty level, and number of questions you'd like to generate.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-800"
              required
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
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
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateExtractedTextExamModal