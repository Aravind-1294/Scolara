"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0A0A0A] overflow-hidden px-4 py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-32 -right-32 rounded-full bg-gradient-to-br from-violet-600/30 to-transparent blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-32 -left-32 rounded-full bg-gradient-to-br from-blue-600/30 to-transparent blur-3xl"></div>
        <div className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-3xl"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Brand Section */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500 mb-3">Welcome Back</h1>
            <p className="text-gray-400 text-lg">Sign in to continue your learning journey</p>
          </motion.div>
        </div>

        {/* Auth Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl transform scale-105"></div>
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2rem] p-1">
            <div className="bg-[#0A0A0A]/60 rounded-[2rem]">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border-none bg-transparent p-8",
                    headerTitle: "text-2xl font-bold text-white text-center",
                    headerSubtitle: "text-gray-400 text-center",
                    formButtonPrimary: "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:scale-[1.02] transition-all duration-200",
                    formFieldInput: "rounded-xl border-2 border-gray-800/50 bg-white/10 text-white focus:border-violet-500 focus:ring-violet-500/20 placeholder:text-gray-500 backdrop-blur-sm",
                    footerAction: "text-gray-400",
                    identityPreviewText: "text-gray-400",
                    formFieldLabel: "text-gray-300 font-medium",
                    formFieldLabelRow: "mb-2",
                    socialButtonsBlockButton: "border-2 border-gray-800/50 bg-white/5 hover:bg-white/10 transition duration-200 rounded-xl text-gray-300 backdrop-blur-sm",
                    socialButtonsBlockButtonText: "text-gray-300 font-medium",
                    dividerLine: "bg-gray-800",
                    dividerText: "text-gray-500",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                    footer: "hidden",
                    card__main: "gap-3",
                  },
                  layout: {
                    socialButtonsPlacement: "bottom",
                    showOptionalFields: false,
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="mb-4 space-x-2">
            <span className="text-gray-400">Don&apos;t have an account?</span>
            <Link 
              href="/sign-up" 
              className="text-violet-500 hover:text-violet-400 font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
          <p className="text-gray-600 text-sm"> 2024 Exam Portal. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}