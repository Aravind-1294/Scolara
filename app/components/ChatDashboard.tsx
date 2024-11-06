'use client'
import { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  DocumentIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface ChatBotData {
  id: string;
  name: string;
  files: string[];
  createdAt: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const MAX_FILES = 2;
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ['application/pdf'];

interface FileError {
  file: string;
  error: string;
}

export default function ChatDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [chatBots, setChatBots] = useState<ChatBotData[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only PDF files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 1MB';
    }
    return null;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    setFileErrors([]); // Clear previous errors
    
    // Check if adding new files would exceed the limit
    if (uploadedFiles.length + files.length > MAX_FILES) {
      setFileErrors([{ 
        file: 'Multiple files', 
        error: `You can only upload up to ${MAX_FILES} files` 
      }]);
      return;
    }

    const newFiles: UploadedFile[] = [];
    const errors: FileError[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push({ file: file.name, error });
      } else {
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="p-8">
      {/* Header section - Always visible */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat with Your Data</h1>
          <p className="text-gray-600 mt-1">
            Create custom AI chatbots trained on your documents. Upload PDFs, text files, or documents 
            to build a knowledge base for your chatbot.
          </p>
        </div>
      </div>

      {isCreating ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Create New Chatbot</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {uploadedFiles.length === 0 ? (
              <div
                className={`relative group ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                } border-2 border-dashed rounded-xl transition-all duration-300`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="p-12">
                  <div className="text-center">
                    {/* Upload icon */}
                    <div className="mx-auto h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                      <ArrowUpTrayIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Upload your documents
                      </h3>
                      <p className="text-sm text-gray-500">
                        Drag and drop your files here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Upload up to 2 PDF files (Max size: 1MB each)
                      </p>
                    </div>

                    {/* File input button */}
                    <div className="mt-8">
                      <label className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <span className="text-sm font-medium">Browse files</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                    </div>

                    {/* Error Messages */}
                    {fileErrors.length > 0 && (
                      <div className="mt-4">
                        {fileErrors.map((error, index) => (
                          <div key={index} className="text-sm text-red-600">
                            {error.file}: {error.error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Uploaded Files ({uploadedFiles.length}/{MAX_FILES})
                  </h3>
                  {uploadedFiles.length < MAX_FILES && (
                    <label className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Add More Files</span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  )}
                </div>

                {/* File List */}
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={file.name + index}
                      className={`flex items-center justify-between p-4 ${
                        index !== uploadedFiles.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded">
                          <DocumentIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Error Messages */}
                {fileErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    {fileErrors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        {error.file}: {error.error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Create Bot Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      console.log('Creating bot with files:', uploadedFiles);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Bot
                  </button>
                </div>
              </div>
            )}

            {uploadedFiles.length === 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Guidelines:</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Upload multiple files to create a comprehensive knowledge base
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Files should be text-based and readable
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    Ensure documents contain relevant information for your chatbot
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Regular dashboard view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Bot Card */}
          <div 
            onClick={() => setIsCreating(true)} 
            className="group cursor-pointer"
          >
            <div className="relative h-[200px] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:bg-blue-50 transition-colors duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PlusIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Bot</h3>
                <p className="text-sm text-gray-500">
                  Upload your documents to create a custom AI chatbot
                </p>
              </div>
            </div>
          </div>

          {/* Existing Chatbots */}
          {chatBots.map((bot) => (
            <div key={bot.id} className="h-[200px] bg-white rounded-2xl border border-gray-200 p-6">
              {/* Bot card content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
