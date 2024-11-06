"use client";
import { useState } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if we're on the home page
    if (window.location.pathname !== '/') {
      // If not, navigate to home page with features section
      router.push('/#features');
    } else {
      // If we are, just scroll to features
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 py-4 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            >
              Scolara
            </motion.div>
          </Link>

          <div className="hidden md:flex space-x-8">
            <motion.a
              href="#features"
              onClick={handleFeaturesClick}
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Features
            </motion.a>
            <Link href="/pricing">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 hover:text-blue-600 cursor-pointer"
              >
                Pricing
              </motion.span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link href="/Dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/Dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200"
              >
                Get Started
              </motion.button>
            </Link> 
          </div>
        </div>
      </div>
    </motion.nav>
  );
}