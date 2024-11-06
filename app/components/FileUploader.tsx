// components/FileUploader.tsx
import { useState, useCallback } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf" || 
          file.type === "text/plain" || 
          file.type.startsWith("image/")) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }, [onFileSelect])

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.txt,image/*"
        onChange={handleFileSelect}
      />
      <div className="text-center">
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-900">
          Drag and drop your file here
        </p>
        <p className="mt-1 text-sm text-gray-500">
          or click to select a file
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Supported formats: PDF, TXT, Images
        </p>
      </div>
    </div>
  )
}