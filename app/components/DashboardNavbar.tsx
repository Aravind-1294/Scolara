'use client'
import { BellIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const DashboardNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-end h-16 px-8">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6" />
          </button>
          <Link href="/settings" className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <Cog6ToothIcon className="h-6 w-6" />
          </Link>
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
            <UserCircleIcon className="h-6 w-6" />
            <span>Account</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar