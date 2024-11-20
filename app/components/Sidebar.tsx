'use client'
import { useState, useEffect } from 'react'
import { 
  HomeIcon, 
  SparklesIcon, 
  BellIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import clsx from 'clsx'
import { ThemeToggle } from './ThemeToggle'
import { Progress } from "../components/ui/progress"

interface SidebarOption {
  id: string
  name: string
  icon: any
  disabled?: boolean
  tag?: string
  isAction?: boolean
  href?: string
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  dailyExamLimit?: {
    count: number
    lastResetDate: string
  }
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
}

const sidebarOptions: SidebarOption[] = [
  // Main navigation
  { id: 'general', name: 'General', icon: HomeIcon },
  { id: 'generate', name: 'Generate with text', icon: SparklesIcon },
  { 
    id: 'chat', 
    name: 'ExamChat', 
    icon: ChatBubbleLeftRightIcon,
    disabled: true,
    tag: 'Coming soon'
  },
  
  // Bottom actions
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: Cog6ToothIcon, 
    isAction: true
  }
]

export default function Sidebar({ activeTab, setActiveTab, dailyExamLimit }: SidebarProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  // Update navigation history when activeTab changes
  useEffect(() => {
    if (activeTab !== navigationHistory[navigationHistory.length - 1]) {
      setNavigationHistory(prev => [...prev, activeTab]);
    }
  }, [activeTab]);

  // Handle back button click
  const handleBackNavigation = () => {
    if (activeTab === 'general') {
      // If on general page, go to landing page
      window.location.href = '/';
    } else {
      // If on any other feature, go to general page
      setActiveTab('general');
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Mobile menu overlay
  const MobileOverlay = () => (
    <div 
      className={clsx(
        "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden",
        isMobileMenuOpen ? "block" : "hidden"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    />
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 dark:text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 dark:text-white" />
          )}
        </button>
        {activeTab !== 'general' && (
          <button
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
            onClick={handleBackNavigation}
          >
            <ArrowLeftIcon className="w-6 h-6 dark:text-white" />
          </button>
        )}
      </div>

      <MobileOverlay />

      <div className={clsx(
        "fixed md:relative flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        "z-50 md:z-auto",
        "md:w-64",
        isMobileMenuOpen ? "w-64 left-0" : "-left-64 md:left-0",
        "md:transform-none"
      )}>
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center relative">
          {activeTab !== 'general' && (
            <button
              onClick={handleBackNavigation}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-black dark:text-white">Scholora</h1>
            <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              BETA
            </span>
          </div>
          <button
            onClick={handleNotificationClick}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 relative"
          >
            <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Notification Popup */}
          {showNotification && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 w-64 z-50">
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 transform rotate-45"></div>
              <p className="text-gray-600 dark:text-gray-300">No notifications/updates as of now</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarOptions.filter(option => !option.isAction).map((option) => (
            <button
              key={option.id}
              onClick={() => {
                if (!option.disabled) {
                  setActiveTab(option.id);
                  setIsMobileMenuOpen(false);
                }
              }}
              className={clsx(
                'w-full flex items-center px-4 py-3 text-left',
                'transition-colors duration-200',
                {
                  'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300': activeTab === option.id && !option.disabled,
                  'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800': activeTab !== option.id && !option.disabled,
                  'text-gray-400 dark:text-gray-600 cursor-not-allowed': option.disabled
                }
              )}
            >
              <option.icon className="w-5 h-5" />
              <span className="ml-3">{option.name}</span>
              {option.tag && (
                <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium
                  bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                  {option.tag}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col space-y-4">
            {/* Daily Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400">Daily Exams</span>
                <span className="font-medium">{dailyExamLimit?.count || 0}/5</span>
              </div>
              <Progress 
                value={((dailyExamLimit?.count || 0) / 5) * 100} 
                className="h-1"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <UserButton afterSignOutUrl="/sign-in" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName || user?.username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    openUserProfile();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}