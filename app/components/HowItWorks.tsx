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
      delay: 0.2,
    },
    {
      number: "02",
      title: "Generate Questions",
      description: "Choose your topic and difficulty level. Get tailored questions to test your knowledge.",
      icon: "⚡",
      delay: 0.4,
    },
    {
      number: "03",
      title: "Learn & Practice",
      description: "Study efficiently with AI-generated summaries and practice with interactive quizzes.",
      icon: "🎓",
      delay: 0.6,
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            How Scolara Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: step.delay }}
              className="relative"
            >
              {/* Background Number */}
              <div className="absolute -top-10 -left-4 text-[120px] font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent select-none">
                {step.number}
              </div>

              {/* Card */}
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <span className="text-5xl">{step.icon}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-semibold mb-6">
            Ready to Transform Your Learning?
          </h3>
          <Link href="/Dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 text-lg shadow-lg shadow-blue-200"
          >
            Get Started Now
          </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}