'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'
import { useRouter, usePathname } from 'next/navigation'


function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const words = ['Money', 'Expenses', 'Transactions'];
  const router = useRouter()


  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 180],
      transition: {
        duration: isMobile ? 8 : 6,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const themeClasses = {
    dark: {
      bg: "from-slate-900 via-slate-800 to-slate-900",
      text: "text-white",
      navBg: "from-slate-800/60 to-slate-700/60",
      cardBg: "from-slate-800/30 to-slate-700/30",
      border: "border-slate-600/50",
      accent: "from-blue-400 to-purple-400"
    },
    light: {
      bg: "from-gray-50 via-blue-50 to-purple-50",
      text: "text-gray-900",
      navBg: "from-white/80 to-gray-100/80",
      cardBg: "from-white/50 to-gray-50/50",
      border: "border-gray-300/50",
      accent: "from-blue-600 to-purple-600"
    }
  };

  const currentTheme = themeClasses[theme];

  const features = [
    {
      icon: '👥',
      title: 'Customer Management',
      description: 'Track all your customer relationships and transaction history in one place.',
      features: ['Customer profiles', 'Transaction history', 'Balance tracking']
    },
    {
      icon: '💰',
      title: 'Split Expenses',
      description: 'Share expenses with friends and family. Track who owes what with automatic calculations.',
      features: ['Group expenses', 'Auto-split calculations', 'Balance settlements', 'Real-time updates']
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} ${currentTheme.text} relative overflow-hidden transition-all duration-700`}>
      {!isMobile && (
        <motion.div
          className={`fixed w-3 h-3 ${isDarkTheme ? 'bg-blue-400/30' : 'bg-blue-600/30'} rounded-full pointer-events-none z-50 mix-blend-difference`}
          animate={{
            x: mousePosition.x - 6,
            y: mousePosition.y - 6,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      )}

      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${isDarkTheme ? 'from-blue-500/20' : 'from-blue-400/30'} via-transparent to-transparent`}></div>
        <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] ${isDarkTheme ? 'from-purple-500/20' : 'from-purple-400/30'} via-transparent to-transparent`}></div>

        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-10 md:top-20 left-4 md:left-20"
        >
          <div className={`w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br ${isDarkTheme ? 'from-blue-500/20 to-blue-600/30 border-blue-400/30' : 'from-blue-400/30 to-blue-500/40 border-blue-500/40'} rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border shadow-lg md:shadow-xl`}>
            <motion.svg
              className={`w-5 h-5 md:w-8 md:h-8 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </motion.svg>
          </div>
        </motion.div>

        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 md:top-40 right-4 md:right-32"
          style={{ animationDelay: '1s' }}
        >
          <div className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br ${isDarkTheme ? 'from-purple-500/20 to-purple-600/30 border-purple-400/30' : 'from-purple-400/30 to-purple-500/40 border-purple-500/40'} rounded-lg md:rounded-xl flex items-center justify-center backdrop-blur-sm border shadow-lg`}>
            <motion.svg
              className={`w-4 h-4 md:w-6 md:h-6 ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{ scale: 1.3, rotate: -15 }}
            >
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </motion.svg>
          </div>
        </motion.div>

        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 md:bottom-40 left-4 md:left-32"
          style={{ animationDelay: '2s' }}
        >
          <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${isDarkTheme ? 'from-green-500/20 to-green-600/30 border-green-400/30' : 'from-green-400/30 to-green-500/40 border-green-500/40'} rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border shadow-lg`}>
            <motion.svg
              className={`w-5 h-5 md:w-7 md:h-7 ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{ scale: 1.4, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </motion.svg>
          </div>
        </motion.div>

        {[...Array(isMobile ? 5 : 15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${isDarkTheme ? 'bg-blue-400/40' : 'bg-blue-600/40'} rounded-full`}
            initial={{
              x: Math.random() * (isMobile ? 350 : windowSize.innerWidth),
              y: Math.random() * (isMobile ? 600 : windowSize.innerHeight),
              opacity: 0
            }}
            animate={{
              y: [null, -50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        className="mt-3 relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-6xl mx-auto px-4 md:px-6">

          <motion.div
            className={`inline-flex items-center px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r ${currentTheme.navBg} border ${currentTheme.border} rounded-full text-xs md:text-sm mb-6 md:mb-8 backdrop-blur-md shadow-lg md:shadow-xl`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.span
              className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 md:mr-3 shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="flex items-center font-medium">
              <motion.svg
                className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </motion.svg>
              Personal Finance Made Simple
            </span>
          </motion.div>

          <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 leading-tight">
              Track Your{' '}
              <br className="hidden sm:block" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  className={`bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent inline-block`}
                  initial={{ opacity: 0, y: 30, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -30, rotateX: 90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
              <br />
              <span className={`${isDarkTheme ? 'text-slate-200' : 'text-gray-700'}`}>Like Never Before</span>
            </h1>
            <motion.div
              className={`h-1 md:h-1.5 w-24 md:w-40 bg-gradient-to-r ${currentTheme.accent} mx-auto rounded-full shadow-lg`}
              initial={{ width: 0 }}
              animate={{ width: isMobile ? 96 : 160 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </motion.div>

          <motion.p
            className={`text-base md:text-xl lg:text-2xl ${isDarkTheme ? 'text-slate-300' : 'text-gray-600'} mb-8 md:mb-12 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-2`}
            variants={itemVariants}
          >
            MoneyMate helps you manage personal transactions with{' '}
            <motion.span
              className={`${isDarkTheme ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-100'} font-semibold px-2 py-1 rounded-lg`}
              whileHover={{ scale: 1.05 }}
            >
              complete transparency
            </motion.span>{' '}
            and ease. Stay organized, track history, and take control of your finances.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4"
            variants={itemVariants}
          >
            <motion.button
              className={`group relative bg-gradient-to-r ${currentTheme.accent} hover:shadow-xl px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl text-base md:text-lg font-bold transition-all duration-500 shadow-lg overflow-hidden text-white`}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: isDarkTheme ? "0 25px 50px -12px rgba(59, 130, 246, 0.5)" : "0 25px 50px -12px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/sign-up')}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${isDarkTheme ? 'from-blue-400 to-purple-400' : 'from-blue-500 to-purple-500'}`}
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <motion.svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
                Get Started Free
                <motion.svg
                  className="w-4 h-4 md:w-5 md:h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-bold ${currentTheme.text} mb-6`}>
              Everything You Need to{' '}
              <span className={`bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
                Manage Money
              </span>
            </h2>
            <p className={`text-lg md:text-xl ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              From personal transactions to group expenses, MoneyMate provides all the tools you need for complete financial transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-8 backdrop-blur-md hover:shadow-xl transition-all duration-500`}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>{feature.title}</h3>
              <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} mb-6`}>{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className={`flex items-center text-sm ${isDarkTheme ? 'text-slate-300' : 'text-gray-700'}`}>
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 md:py-32 mb-15 md:mb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-bold ${currentTheme.text} mb-6`}>
              How It{' '}
              <span className={`bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
                Works
              </span>
            </h2>
            <p className={`text-lg md:text-xl ${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Get started with MoneyMate in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              step: '01',
              title: 'Sign Up',
              description: 'Create your free MoneyMate account in seconds. No credit card required.'
            },
            {
              step: '02',
              title: 'Add Customers',
              description: 'Start by adding your customers and begin tracking your transactions with them.'
            },
              {
                step: '03',
                title: 'Track & Split',
                description: 'Record transactions and create split rooms for group expenses. Everything is calculated automatically.'
              }].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.accent} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg`}>
                    {step.step}
                  </div>
                  <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>{step.title}</h3>
                  <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'}`}>{step.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <motion.div
        className="absolute bottom-3 md:bottom-8 left-1/2 transform -translate-x-1/2 md:mb-12 mb-10 mt-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="group cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className={`w-6 h-10 md:w-8 md:h-12 border-2 ${isDarkTheme ? 'border-slate-500 group-hover:border-blue-400' : 'border-gray-400 group-hover:border-blue-500'} rounded-full flex justify-center transition-colors duration-300 relative overflow-hidden`}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className={`w-1 h-3 md:w-1.5 md:h-4 bg-gradient-to-b ${currentTheme.accent} rounded-full mt-2`}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <motion.p
            className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-gray-500'} mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Scroll
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero