"use client";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
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
  },
];

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
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
          <p className="text-blue-600 mt-2">
            Note: Currently only offering Free tier. Paid plans coming soon!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: tier.name === "Free" ? 1.02 : 1 }}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                tier.popular ? "border-2 border-blue-500" : ""
              } ${tier.name !== "Free" ? "opacity-75" : ""}`}
            >
              {tier.popular && (
                <span className="absolute top-0 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Coming Soon
                </span>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <motion.button
                  onClick={() => handlePlanSelection(tier.name)}
                  whileHover={{ scale: tier.name === "Free" ? 1.05 : 1 }}
                  className={`w-full py-3 px-6 rounded-lg mb-8 flex items-center justify-center gap-2 ${
                    tier.name === "Free"
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={tier.name !== "Free"}
                >
                  {tier.name !== "Free" && <Lock className="h-4 w-4" />}
                  {tier.name === "Free" ? tier.buttonText : "Coming Soon"}
                </motion.button>
              </div>
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className={`h-5 w-5 mr-3 ${
                      tier.name === "Free" ? "text-green-500" : "text-gray-400"
                    }`} />
                    <span className={`${
                      tier.name === "Free" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
