'use client'
import { useState, useRef } from 'react'
import { 
  HomeIcon, 
  SparklesIcon, 
  BeakerIcon,
  BellIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'
import { UserButton, useUser, useClerk } from "@clerk/nextjs";

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

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [showNotification, setShowNotification] = useState(false);
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center relative">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-black">Scholora</h1>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-600">
            BETA
          </span>
        </div>
        <button
          onClick={handleNotificationClick}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
          {/* Notification dot */}
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Notification Popup */}
        {showNotification && (
          <div className="absolute top-full -right-48 mt-2 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64 z-50">
            {/* Arrow pointing to bell */}
            <div className="absolute -top-2 right-52 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
            <p className="text-gray-600">No notifications/updates as of now</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sidebarOptions.filter(option => !option.isAction).map((option) => (
          <button
            key={option.id}
            onClick={() => !option.disabled && setActiveTab(option.id)}
            className={clsx(
              'w-full flex items-center px-4 py-3 text-left',
              'transition-colors duration-200',
              {
                'bg-blue-50 text-blue-600': activeTab === option.id && !option.disabled,
                'text-gray-600 hover:bg-gray-50': activeTab !== option.id && !option.disabled,
                'text-gray-400 cursor-not-allowed': option.disabled
              }
            )}
          >
            <option.icon className="w-5 h-5 mr-3" />
            <span>{option.name}</span>
            {option.tag && (
              <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium
                bg-purple-100 text-purple-600">
                {option.tag}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Action Items (former navbar) */}
      <div className="border-t border-gray-200 py-4">
        {/* User Profile (non-clickable) */}
        <div className="relative w-full flex items-center px-4 py-3 text-gray-600">
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="ml-3 text-sm truncate">
            {user?.emailAddresses[0]?.emailAddress || 'Loading...'}
          </span>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => openUserProfile()}
          className="relative w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="relative w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}