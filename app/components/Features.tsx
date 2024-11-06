"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
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
      title: "24/7 AI Support",
      description: "Get help anytime with our intelligent chatbot assistant.",
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
            d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      ),
      color: "from-green-500/10 to-green-500/20",
      expandedContent: {
        title: "Your Personal AI Tutor",
        description:
          "Have questions? Our AI tutor is always ready to help. Get instant explanations, step-by-step solutions, and personalized learning recommendations any time of day.",
        benefits: [
          "24/7 availability",
          "Contextual responses",
          "Multiple teaching styles",
          "Interactive discussions",
          "Concept clarification",
        ],
        image: "/ai-support.png",
      },
    },
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to transform your learning experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index}>
              <motion.div
                layoutId={`card-${index}`}
                onClick={() => setExpandedId(index)}
                className={`cursor-pointer p-8 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-white/20 h-full transform transition-all duration-300 hover:shadow-xl ${
                  expandedId === null ? "hover:-translate-y-2" : ""
                }`}
              >
                <div className="text-blue-600 mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                {expandedId !== index && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    Learn more
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Expanded Card Modal */}
        <AnimatePresence>
          {expandedId !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedId(null)}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                  layoutId={`card-${expandedId}`}
                  className="w-full max-w-2xl"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6"
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
                      </button>

                      <div className="text-blue-600 mb-6">
                        {features[expandedId].icon}
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-gray-800">
                        {features[expandedId].expandedContent.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {features[expandedId].expandedContent.description}
                      </p>

                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h4 className="text-lg font-semibold mb-4">Key Benefits</h4>
                        <ul className="space-y-3">
                          {features[expandedId].expandedContent.benefits.map(
                            (benefit, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center text-gray-700"
                              >
                                <svg
                                  className="w-5 h-5 text-green-500 mr-3"
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
                                {benefit}
                              </motion.li>
                            )
                          )}
                        </ul>
                      </div>
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