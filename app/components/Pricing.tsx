"use client";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Free",
    price: "0",
    features: [
      "Basic document analysis",
      "Up to 5 documents per month",
      "Standard support",
      "Basic analytics",
    ],
    buttonText: "Get Started",
    popular: false,
    gradient: "from-blue-50 to-indigo-50",
    highlightGradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Pro",
    price: "9",
    features: [
      "Advanced document analysis",
      "Up to 50 documents per month",
      "Priority support",
      "Advanced analytics",
      "Custom templates",
    ],
    buttonText: "Start Pro Plan",
    popular: true,
    gradient: "from-violet-50 to-purple-50",
    highlightGradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Enterprise",
    price: "19",
    features: [
      "Unlimited document analysis",
      "Unlimited documents",
      "24/7 Priority support",
      "Advanced analytics & reporting",
      "Custom templates",
      "API access",
    ],
    buttonText: "Contact Sales",
    popular: false,
    gradient: "from-fuchsia-50 to-pink-50",
    highlightGradient: "from-fuchsia-500 to-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Pricing() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handlePlanSelection = (tierName: string) => {
    if (tierName === "Free") {
      if (!isSignedIn) {
        router.push('/sign-up');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Special Launch Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
          <div className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-blue-600 font-medium">
              Note: Currently only offering Free tier. Paid plans coming soon!
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={itemVariants}
              whileHover={{ scale: tier.name === "Free" ? 1.02 : 1, translateY: -5 }}
              className={`relative rounded-3xl bg-white p-8 shadow-lg border transition-shadow duration-300
                ${tier.popular ? "shadow-xl ring-2 ring-violet-500" : "hover:shadow-xl"}
                ${tier.name !== "Free" ? "opacity-75" : ""}`}
            >
              {tier.popular && (
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-1.5 rounded-full text-sm font-medium shadow-lg"
                >
                  Coming Soon
                </motion.span>
              )}
              
              <div className="text-center">
                <div className={`inline-block p-3 rounded-2xl bg-gradient-to-r ${tier.gradient} mb-4`}>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${tier.highlightGradient} bg-clip-text text-transparent`}>
                    {tier.name}
                  </h3>
                </div>
                
                <div className="flex justify-center items-baseline mb-6">
                  <span className={`text-5xl font-bold bg-gradient-to-r ${tier.highlightGradient} bg-clip-text text-transparent`}>
                    ${tier.price}
                  </span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                <motion.button
                  onClick={() => handlePlanSelection(tier.name)}
                  whileHover={{ scale: tier.name === "Free" ? 1.05 : 1 }}
                  whileTap={{ scale: tier.name === "Free" ? 0.95 : 1 }}
                  className={`w-full py-3.5 px-6 rounded-xl mb-8 flex items-center justify-center gap-2 font-medium transition-all duration-200
                    ${tier.name === "Free"
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer"
                      : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-400 cursor-not-allowed"}`}
                  disabled={tier.name !== "Free"}
                >
                  {tier.name !== "Free" && <Lock className="h-4 w-4" />}
                  {tier.name === "Free" ? tier.buttonText : "Coming Soon"}
                </motion.button>
              </div>

              <div className="space-y-4">
                {tier.features.map((feature) => (
                  <motion.div
                    key={feature}
                    whileHover={{ x: 5 }}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${tier.gradient} mr-3`}>
                      <Check className={`h-5 w-5 ${
                        tier.name === "Free" 
                          ? `bg-gradient-to-r ${tier.highlightGradient} bg-clip-text text-transparent` 
                          : "text-gray-400"
                      }`} />
                    </div>
                    <span className={`${
                      tier.name === "Free" ? "text-gray-700" : "text-gray-400"
                    } font-medium`}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
