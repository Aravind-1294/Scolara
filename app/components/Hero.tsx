"use client";
import { motion } from "framer-motion";
import Link from 'next/link'
import Counter from './Counter';
import { useState, useEffect } from 'react';
import { FiCode, FiDatabase, FiCpu, FiAward } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineLightBulb, HiOutlineRefresh } from 'react-icons/hi';
import { BsArrowRight, BsStars } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface FloatingIconProps {
  icon: IconType;
  delay?: number;
  className?: string;
}

function ArcadeEmbed() {
  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(52.21621621621622% + 41px)', height: 0, width: '100%' }}>
      <iframe
        src="https://demo.arcade.software/1U0WgmmZLSOK8Zn0jiXR?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Scolara - AI-Powered Education Platform"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>
  )
}

function FloatingIcon({ icon: Icon, delay = 0, className = "" }: FloatingIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute text-2xl ${className}`}
    >
      <Icon />
    </motion.div>
  );
}

export default function Hero() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const sampleQuestion = {
    question: "What is the primary benefit of using AI in education?",
    options: [
      "Personalized Learning Experience",
      "Instant Feedback and Assessment",
      "Adaptive Content Delivery",
      "Interactive Study Materials"
    ]
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('modal-overlay')) {
      setShowDemo(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(219,39,119,0.1),transparent_50%)]" />
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-30"
          initial={{ backgroundPosition: '0% 0%' }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 20%, transparent 100%)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      
      {/* Enhanced Floating Icons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <FloatingIcon icon={FiCode} className="top-20 left-[15%] text-indigo-500/40 text-2xl" delay={0} />
        <FloatingIcon icon={FiDatabase} className="top-40 right-[20%] text-purple-500/40 text-3xl" delay={1} />
        <FloatingIcon icon={FiCpu} className="bottom-32 left-[25%] text-blue-500/40 text-2xl" delay={2} />
        <FloatingIcon icon={HiOutlineSparkles} className="top-1/3 left-[75%] text-pink-500/40 text-3xl" delay={3} />
        <FloatingIcon icon={BsStars} className="bottom-1/4 right-[30%] text-indigo-500/40 text-2xl" delay={4} />
        <FloatingIcon icon={HiOutlineLightBulb} className="top-1/4 right-[10%] text-purple-500/40 text-3xl" delay={5} />
      </motion.div>

      {/* Main Content */}
      <div className="relative container mx-auto px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-32 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full items-center">
          {/* Left Column - Enhanced Text and Buttons */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-14 left-0 text-sm font-medium">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  New Feature Released
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Learn Smarter
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600/90 mb-12 max-w-xl leading-relaxed"
            >
              Experience the future of education with our AI-powered platform. 
              Master concepts faster, learn smarter, and achieve more with personalized learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-5 mb-16"
            >
              <motion.button
                onClick={() => setShowDemo(true)}
                className="group px-8 py-4 text-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold 
                  relative overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300
                  hover:scale-105 transform flex items-center gap-3 w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Watch Demo <BsArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/signup" 
                  className="group px-8 py-4 text-lg rounded-2xl border-2 border-indigo-100 text-gray-700 font-semibold 
                    hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300 w-full sm:w-auto inline-block text-center
                    relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Get Started <BsArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-12 flex-wrap"
            >
              <div className="relative">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <Counter end={50000} duration={2000} suffix="+" />
                </div>
                <div className="text-gray-600/80 mt-2 font-medium">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  <Counter end={1000} duration={2000} suffix="+" />
                </div>
                <div className="text-gray-600/80 mt-2 font-medium">Course Hours</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  <Counter end={95} duration={2000} suffix="%" />
                </div>
                <div className="text-gray-600/80 mt-2 font-medium">Success Rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Enhanced Interactive Question Demo */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center"
          >
            <motion.div 
              className="bg-white/95 rounded-3xl p-8 shadow-2xl w-full border border-indigo-50 relative overflow-hidden group"
              whileHover={{ 
                boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.15)",
                y: -5
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 opacity-50"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgba(99,102,241,0.08), transparent, rgba(168,85,247,0.08))",
                    "linear-gradient(to bottom right, rgba(168,85,247,0.08), transparent, rgba(99,102,241,0.08))",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="relative">
                <motion.div 
                  className="mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium group-hover:bg-indigo-100 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <HiOutlineLightBulb className="text-lg" />
                    Sample Question
                  </motion.span>
                  <motion.h3 
                    className="text-2xl font-semibold text-gray-800 mt-3 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {sampleQuestion.question}
                  </motion.h3>
                </motion.div>
                <div className="space-y-4">
                  {sampleQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 group/option relative
                        ${selectedAnswer === option 
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10' 
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-white'}`}
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 20px -8px rgba(79, 70, 229, 0.25)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex items-center gap-4">
                        <motion.span 
                          className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-sm font-medium
                            transition-all duration-300 ${
                              selectedAnswer === option 
                                ? 'border-indigo-500 bg-indigo-500 text-white scale-110' 
                                : 'border-gray-200 group-hover/option:border-indigo-200 text-gray-500'
                            }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {String.fromCharCode(65 + index)}
                        </motion.span>
                        <span className="text-gray-700 font-medium relative z-10">
                          {option}
                          {selectedAnswer === option && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"
                              layoutId="highlight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center modal-overlay"
          onClick={handleOutsideClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 w-full max-w-5xl mx-4"
          >
            <ArcadeEmbed />
          </motion.div>
        </div>
      )}
    </div>
  );
}