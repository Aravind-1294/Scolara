"use client";
import React from 'react';
import { motion } from "framer-motion";
import { BsLightning, BsFileText, BsQuestionCircle, BsArrowRight, BsLightningCharge, BsBookmarkStar, BsBarChart } from 'react-icons/bs';
import { FiUpload, FiDatabase } from 'react-icons/fi';
import { IconType } from 'react-icons';
import Link from 'next/link';

interface ChartNodeProps {
  icon: IconType;
  label: string;
  position: string;
  className?: string;
}

const ChartNode: React.FC<ChartNodeProps> = ({ icon: Icon, label, position, className = "" }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    className={`bg-white rounded-lg shadow-xl p-4 w-48 flex flex-col items-center ${className}`}
  >
    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <span className="text-sm font-medium text-gray-800 text-center whitespace-nowrap">{label}</span>
  </motion.div>
);

interface DataPathProps {
  className?: string;
  delay?: number;
  d: string;
}

const DataPath: React.FC<DataPathProps> = ({ className = "", delay = 0, d }) => {
  const pathVariants = {
    initial: {
      pathLength: 0,
      opacity: 0
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, delay },
        opacity: { duration: 0.01, delay }
      }
    }
  };

  return (
    <motion.path
      d={d}
      stroke="url(#data-flow-gradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={pathVariants}
      className={className}
    />
  );
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            How Scolara Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Data Flow Chart */}
          <div className="relative h-[600px]">
            {/* Data Flow Chart */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl border border-gray-100 shadow-lg p-8 overflow-hidden">
              {/* Background Glow Effects */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-2xl" />
              </div>

              {/* Connection Paths and Points Layer */}
              <div className="absolute inset-0 z-0">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="50%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>

                    {/* Dash Array Pattern */}
                    <pattern id="dash-pattern" x="0" y="0" width="20" height="4" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="2" x2="20" y2="2" stroke="url(#flow-gradient)" strokeWidth="2" />
                    </pattern>

                    {/* Flow Animation */}
                    <linearGradient id="animated-flow" x1="0" y1="0" x2="100%" y2="0">
                      <stop offset="0%" stopColor="rgba(79, 70, 229, 0.3)">
                        <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="rgba(124, 58, 237, 0.6)">
                        <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="rgba(147, 51, 234, 0.3)">
                        <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
                      </stop>
                    </linearGradient>
                  </defs>

                  <g>
                    {[
                      // Input to Processing (Left Side) - Structured path
                      "M 120,100 L 180,100 L 180,300 L 220,300",
                      // Processing to Output (Right Side) - Structured path
                      "M 380,300 L 420,300 L 420,500 L 480,500",
                      // Horizontal Connection
                      "M 220,300 L 380,300"
                    ].map((d, index) => (
                      <React.Fragment key={index}>
                        {/* Base Path */}
                        <path
                          d={d}
                          stroke="#E5E7EB"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Animated Path */}
                        <path
                          d={d}
                          stroke="url(#animated-flow)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="4 4"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="8;0"
                            dur="0.5s"
                            repeatCount="indefinite"
                          />
                        </path>

                        {/* Glowing Overlay */}
                        <path
                          d={d}
                          stroke="url(#flow-gradient)"
                          strokeWidth="1"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-20"
                          filter="blur(1px)"
                        />
                      </React.Fragment>
                    ))}

                    {/* Connection Points at Corners */}
                    {[
                      [120, 100],   // Start
                      [180, 100],   // First turn
                      [180, 300],   // Second turn
                      [220, 300],   // Before center
                      [300, 300],   // Center
                      [380, 300],   // After center
                      [420, 300],   // Third turn
                      [420, 500],   // Fourth turn
                      [480, 500]    // End
                    ].map(([cx, cy], index) => (
                      <g key={index}>
                        {/* Larger static circle */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="white"
                          stroke="url(#flow-gradient)"
                          strokeWidth="1"
                          className="opacity-50"
                        />
                        {/* Smaller animated circle */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="2"
                          fill="url(#flow-gradient)"
                          className="opacity-70"
                        >
                          <animate
                            attributeName="r"
                            values="2;3;2"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${index * 0.2}s`}
                          />
                        </circle>
                      </g>
                    ))}
                  </g>
                </svg>
              </div>

              {/* Center AI Node - Positioned at center point */}
              <div 
                className="absolute z-20"
                style={{
                  left: '300px',
                  top: '300px',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-48 h-48">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full h-full"
                  >
                    {/* Processing Animation (Static Ring) */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30">
                        {[0, 90, 180, 270].map((degree, index) => (
                          <motion.div
                            key={index}
                            className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full"
                            style={{
                              top: '50%',
                              left: '50%',
                              transform: `rotate(${degree}deg) translateX(28px)`
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: index * 0.375,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Center Content with Pulse Effect */}
                    <motion.div 
                      className="absolute inset-4 rounded-full bg-white shadow-lg flex items-center justify-center backdrop-blur-sm"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(79, 70, 229, 0.1)",
                          "0 0 0 15px rgba(79, 70, 229, 0)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    >
                      <motion.div
                        className="text-center"
                        animate={{
                          scale: [1, 1.03, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <BsLightning className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Scholara AI</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Input Node */}
              <div className="absolute top-8 left-8 z-10 w-48">
                <ChartNode
                  icon={BsFileText}
                  label="Study Materials"
                  position=""
                  className="w-full"
                />
              </div>

              {/* Output Node */}
              <div className="absolute z-10 w-48" style={{ right: '48px', bottom: '8px' }}>
                <ChartNode
                  icon={BsQuestionCircle}
                  label="AI Generated Questions"
                  position=""
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Right side - Modern Section */}
          <div className="absolute right-0 top-0 bottom-0 w-[600px] flex flex-col justify-center pr-24 z-10">
            {/* Section Title */}
            <div className="mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-indigo-600 mb-4"
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                  How It Works
                </span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Transform Your Study Materials
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600"
              >
                Our AI-powered system analyzes your content and generates tailored questions for effective learning.
              </motion.p>
            </div>

            {/* Features List */}
            <div className="space-y-12">
              {/* Feature 1 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex items-center"
              >
                <motion.div 
                  className="relative"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <BsLightningCharge className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-indigo-500/20 rounded-2xl blur-lg z-[-1]"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                <div className="ml-8">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Content</h3>
                    <p className="text-gray-600 leading-relaxed max-w-lg">
                      Simply upload your study materials in PDF or text format. Our AI will process and analyze the content.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex items-center"
              >
                <motion.div 
                  className="relative"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <BsBookmarkStar className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-purple-500/20 rounded-2xl blur-lg z-[-1]"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </motion.div>

                <div className="ml-8">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Generate Questions</h3>
                    <p className="text-gray-600 leading-relaxed max-w-lg">
                      Choose your topic and difficulty level. Get tailored questions to test your knowledge.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex items-center"
              >
                <motion.div 
                  className="relative"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                    <BsBarChart className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-pink-500/20 rounded-2xl blur-lg z-[-1]"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </motion.div>

                <div className="ml-8">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn & Practice</h3>
                    <p className="text-gray-600 leading-relaxed max-w-lg">
                      Study efficiently with AI-generated summaries and practice with interactive quizzes.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Optional: Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started
                <BsArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 25px rgba(79, 70, 229, 0.45)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium transition-all bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 rounded-xl group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
            <span className="relative inline-flex items-center gap-2 text-white text-lg font-semibold tracking-wider">
              <Link href="/sign-up">Get Started Now</Link>
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </motion.button>
          <p className="mt-4 text-gray-400 text-sm">
            Start your AI-powered learning journey today
          </p>
        </motion.div>
      </div>
    </section>
  );
}