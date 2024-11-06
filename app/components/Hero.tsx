"use client";
import { motion } from "framer-motion";
import Counter from './Counter';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [text, setText] = useState("Smarter");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const words = ["Smarter", "Clever"];
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = "";

    const type = () => {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        currentText = currentWord.substring(0, currentText.length - 1);
      } else {
        currentText = currentWord.substring(0, currentText.length + 1);
      }

      setText(currentText);

      let typeSpeed = isDeleting ? 100 : 200;

      if (!isDeleting && currentText === currentWord) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % words.length;
        typeSpeed = 500; // Pause before starting new word
      }

      setTimeout(type, typeSpeed);
    };

    type();

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const backgroundVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.2, 0.3],
      transition: {
        duration: 8,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      {/* Animated Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          variants={backgroundVariants}
          animate="animate"
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
        />
        <motion.div 
          variants={backgroundVariants}
          animate="animate"
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl backdrop-blur-sm border border-white/20"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full backdrop-blur-sm border border-white/20"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Gradient Border Decoration */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-8"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Learn {text}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity inline-block w-[2px] h-[0.7em] bg-black -mb-1 ml-[2px]`}>
                </span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                with AI Power
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              Transform your learning journey with AI-generated questions,
              <br className="hidden md:block" /> instant insights, and personalized guidance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg shadow-lg shadow-blue-200/50 relative overflow-hidden"
              >
                <span className="relative z-10">Start Learning Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-transparent bg-white/80 backdrop-blur-sm rounded-xl text-lg relative group"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Watch Demo
                </span>
                <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" style={{ mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: 10000, label: "Students", suffix: "+" },
                { value: 50000, label: "Questions", suffix: "+" },
                { value: 99, label: "Satisfaction", suffix: "%" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <Counter 
                      end={stat.value} 
                      duration={2000}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}