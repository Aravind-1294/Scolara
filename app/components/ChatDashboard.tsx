'use client'
import { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";
import { 
  PlusIcon, XMarkIcon, ArrowUpTrayIcon, DocumentIcon, TrashIcon, 
  ChatBubbleLeftRightIcon, PaperAirplaneIcon, ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const API_BASE = 'https://web-production-a45d3.up.railway.app';

interface ChatSession {
  id: string;
  pdf_name: string;
  created_at: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  content: string;
}

const parseMarkdown = (text: string) => {
  // Split by bold (**text**), lists (* text), or newlines
  return text.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
    if (part === '\n') return <br key={index} />;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function ChatDashboard() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch all sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;
      setIsLoadingSessions(true);
      try {
        const email = user.emailAddresses[0].emailAddress;
        const res = await fetch(`${API_BASE}/api/chat-sessions?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setSessions(data.sessions);
        }
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setIsLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [user]);

  // Fetch chat history when active session changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!activeSessionId) return;
      try {
        const res = await fetch(`${API_BASE}/api/chat-history?sessionId=${activeSessionId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    if (activeSessionId) {
      setMessages([]); // Clear old messages before fetching
      fetchHistory();
    }
  }, [activeSessionId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userEmail', user?.emailAddresses?.[0]?.emailAddress || '');

    try {
      const res = await fetch(`${API_BASE}/api/embed-pdf`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Add new session to top of list
        const newSession: ChatSession = {
          id: data.sessionId,
          pdf_name: file.name,
          created_at: new Date().toISOString()
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(data.sessionId);
      } else {
        alert('Failed to process PDF: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload PDF. Check your backend logs.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (e.target) e.target.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeSessionId || isSending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    
    // Optimistic UI update
    const newMessage: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, newMessage]);
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: messageText
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        alert('Failed to send message: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while sending message');
    } finally {
      setIsSending(false);
    }
  };

  if (activeSessionId) {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        {/* Chat Header */}
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <button 
            onClick={() => setActiveSessionId(null)}
            className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <DocumentIcon className="w-5 h-5 mr-2 text-blue-500" />
              {activeSession?.pdf_name || 'Document Chat'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ask questions about this PDF</p>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">PDF Processed Successfully!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  I have read the document. You can now ask me any questions about its contents.
                </p>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.role === 'model' ? parseMarkdown(msg.content) : msg.content}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about this document..."
              disabled={isSending}
              className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full pl-6 pr-14 py-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5 -mt-0.5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard / Library View
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ExamChat</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload any PDF to instantly chat with it, ask questions, and extract insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-1">
          <label className="block cursor-pointer h-[240px] bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden group">
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center h-full p-6 text-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                ) : (
                  <ArrowUpTrayIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isUploading ? 'Processing PDF...' : 'Upload New PDF'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isUploading ? 'Chunking and reading document...' : 'Click to browse. PDF files only.'}
              </p>
            </div>
          </label>
        </div>

        {/* Library Card */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-full min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DocumentIcon className="w-5 h-5 mr-2 text-gray-500" />
              Your Document Library
            </h3>
            
            {isLoadingSessions ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400 space-y-3">
                <DocumentIcon className="w-10 h-10 opacity-50" />
                <p>No documents uploaded yet. Upload a PDF to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
                        <DocumentIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{session.pdf_name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4">
                      <ArrowLeftIcon className="w-5 h-5 text-gray-400 transform rotate-180" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
