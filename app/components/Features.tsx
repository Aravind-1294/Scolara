"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  expandedContent: {
    title: string;
    description: string;
    benefits: string[];
    image: string;
  };
}

export default function Features() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setExpandedId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const features: Feature[] = [
    {
      title: "AI-Generated Questions",
      description: "Customized practice questions based on your level and topic.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      ),
      color: "from-blue-500/10 to-blue-500/20",
      expandedContent: {
        title: "Smart Question Generation",
        description:
          "Our advanced AI algorithms analyze your learning materials and generate questions that adapt to your knowledge level. As you progress, the questions become more challenging, ensuring optimal learning outcomes.",
        benefits: [
          "Adaptive difficulty levels",
          "Custom question formats",
          "Real-time feedback",
          "Progress tracking",
          "Spaced repetition",
        ],
        image: "/question-generation.png",
      },
    },
    {
      title: "Smart Learning",
      description: "Upload materials and get instant insights. Break down complex topics.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 007.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
      ),
      color: "from-purple-500/10 to-purple-500/20",
      expandedContent: {
        title: "Intelligent Content Analysis",
        description:
          "Upload any study material and watch as our AI breaks it down into easily digestible concepts. Get instant summaries, key points, and visual representations of complex topics.",
        benefits: [
          "Quick content digestion",
          "Visual concept mapping",
          "Key points extraction",
          "Related topic suggestions",
          "Customized study plans",
        ],
        image: "/smart-learning.png",
      },
    },
    {
      title: "Track Your Progress",
      description: "Comprehensive analytics and insights about your exam performance.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      color: "from-green-500/10 to-green-500/20",
      expandedContent: {
        title: "Comprehensive Performance Analytics",
        description:
          "Get detailed insights into your exam performance with our advanced analytics dashboard. Track your progress over time, analyze performance trends, and identify areas for improvement.",
        benefits: [
          "Overall exam performance metrics",
          "Weekly and daily exam statistics",
          "Latest scores and averages",
          "Performance trend analysis",
          "Subject-wise breakdown",
        ],
        image: "/exam-analytics.png",
      },
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-slate-50">
      {/* Modern background with animated patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50" />
      </div>
      
      {/* Floating elements */}
      <div aria-hidden="true" className="absolute -top-48 left-0 transform translate-x-[-30%]">
        <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl animate-blob" />
      </div>
      <div aria-hidden="true" className="absolute -top-48 right-0 transform translate-x-[30%]">
        <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-100/50 backdrop-blur-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-blue-500 to-violet-500"></span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-medium">
              Powerful Features
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-violet-900 to-gray-900"
          >
            Everything You Need to Excel
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg md:text-xl"
          >
            Powerful tools and features designed to transform your learning experience
            and help you achieve your goals faster.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <motion.div
                layoutId={`card-${index}`}
                onClick={() => setExpandedId(index)}
                className="relative h-full overflow-hidden rounded-2xl transition-all duration-300"
              >
                {/* Card Design */}
                <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300
                  group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:border-violet-100">
                  {/* Icon Container */}
                  <div className="mb-8 relative">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.color} transition-transform duration-300
                      group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="w-8 h-8 text-violet-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="absolute inset-0 blur-2xl opacity-30" style={{ background: feature.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>

                  {/* Learn More Button */}
                  {!expandedId && (
                    <button className="inline-flex items-center text-violet-600 font-medium hover:text-violet-700 transition-colors duration-200">
                      Learn more
                      <svg
                        className="w-5 h-5 ml-2 transform transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Modal */}
        <AnimatePresence>
          {expandedId !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedId(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  layoutId={`card-${expandedId}`}
                  className="w-full max-w-2xl"
                  ref={cardRef}
                >
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Close Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(null);
                      }}
                      className="absolute -right-3 -top-3 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition-colors duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>

                    {/* Modal Content */}
                    <div className="space-y-8">
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/20"
                      >
                        {features[expandedId].icon}
                      </motion.div>

                      {/* Title & Description */}
                      <div className="space-y-4">
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-violet-900 to-gray-900"
                        >
                          {features[expandedId].expandedContent.title}
                        </motion.h3>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-gray-600 leading-relaxed text-lg"
                        >
                          {features[expandedId].expandedContent.description}
                        </motion.p>
                      </div>

                      {/* Benefits */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-8"
                      >
                        <h4 className="text-xl font-semibold text-gray-900 mb-6">
                          Key Benefits
                        </h4>
                        <ul className="space-y-4">
                          {features[expandedId].expandedContent.benefits.map(
                            (benefit, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center text-gray-700 group"
                              >
                                <span className="flex-shrink-0 w-6 h-6 mr-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                                <span className="group-hover:text-violet-700 transition-colors duration-300">
                                  {benefit}
                                </span>
                              </motion.li>
                            )
                          )}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}