"use client";
import { motion } from "framer-motion";
import Link from 'next/link'

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Content",
      description: "Simply upload your study materials in PDF or text format. Our AI will process and analyze the content.",
      icon: "📄",
      gradient: "from-blue-50 to-indigo-50",
      textGradient: "from-blue-600 to-indigo-600",
    },
    {
      number: "02",
      title: "Generate Questions",
      description: "Choose your topic and difficulty level. Get tailored questions to test your knowledge.",
      icon: "⚡",
      gradient: "from-violet-50 to-purple-50",
      textGradient: "from-violet-600 to-purple-600",
    },
    {
      number: "03",
      title: "Learn & Practice",
      description: "Study efficiently with AI-generated summaries and practice with interactive quizzes.",
      icon: "🎓",
      gradient: "from-fuchsia-50 to-pink-50",
      textGradient: "from-fuchsia-600 to-pink-600",
    }
  ];

  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-violet-50/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

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

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Lines */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-violet-100 to-fuchsia-100 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className={`absolute -top-10 -left-6 text-8xl font-bold opacity-10 select-none bg-gradient-to-r ${step.textGradient} bg-clip-text text-transparent`}>
                {step.number}
              </div>

              {/* Card */}
              <div className={`relative z-10 bg-gradient-to-br ${step.gradient} rounded-3xl p-8 shadow-lg border border-white/50`}>
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                  <span className="text-3xl">{step.icon}</span>
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${step.textGradient} bg-clip-text text-transparent`}>
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
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