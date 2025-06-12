'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'

function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const words = ['Money', 'Expenses', 'Finances', 'Transactions'];
  
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'

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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} ${currentTheme.text} relative overflow-hidden transition-all duration-700`}>
      {/* Animated Cursor Follower - Desktop Only */}
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

      {/* Enhanced Background with Floating Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${isDarkTheme ? 'from-blue-500/20' : 'from-blue-400/30'} via-transparent to-transparent`}></div>
        <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] ${isDarkTheme ? 'from-purple-500/20' : 'from-purple-400/30'} via-transparent to-transparent`}></div>
        
        {/* Floating Icons - Responsive */}
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
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
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
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
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
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </motion.svg>
          </div>
        </motion.div>

        {/* Animated Particles - Reduced for mobile */}
        {[...Array(isMobile ? 5 : 15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${isDarkTheme ? 'bg-blue-400/40' : 'bg-blue-600/40'} rounded-full`}
            initial={{
              x: Math.random() * (isMobile ? 350 : window.innerWidth),
              y: Math.random() * (isMobile ? 600 : window.innerHeight),
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

      {/* Enhanced Navigation */}
      <motion.nav 
        className="relative z-20 flex justify-between items-center p-4 md:p-6 lg:px-12"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center space-x-2 md:space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${currentTheme.accent} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20V4l8 9 8-9v16" />
            </svg>
          </motion.div>
          <span className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
            MoneyMate
          </span>
        </motion.div>
        
        <div className="flex items-center space-x-4 md:space-x-8">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 md:p-3 rounded-lg ${isDarkTheme ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'} shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkTheme ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkTheme ? (
                <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {['Features', 'About', 'Contact'].map((item, index) => (
              <motion.a 
                key={item}
                href="#" 
                className={`${isDarkTheme ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors relative text-sm lg:text-base`}
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${currentTheme.accent}`}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <Link href="/sign-in" className='hover:scale-105 transition-transform cursor-pointer'>
            <motion.button 
              className={`cursor-pointer group bg-gradient-to-r ${currentTheme.accent} hover:shadow-lg px-4 py-2 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-300 shadow-md relative overflow-hidden text-white text-sm lg:text-base`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
                <span className="relative z-10 font-semibold">Sign In</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <svg className={`w-6 h-6 ${currentTheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${currentTheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`md:hidden absolute top-20 left-4 right-4 z-30 bg-gradient-to-br ${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl backdrop-blur-md shadow-xl overflow-hidden`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-4">
              {['Features', 'About', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className={`block text-lg font-semibold ${isDarkTheme ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors py-2`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white px-6 py-3 rounded-xl font-semibold shadow-lg mt-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/sign-in">Sign In</Link>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-6xl mx-auto px-4 md:px-6">
          
          {/* Enhanced Badge */}
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
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </motion.svg>
              Personal Finance Made Simple
            </span>
          </motion.div>

          {/* Main Heading with Word Animation */}
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
                  transition={{ duration: 0.6, ease: "easeInOut" }}
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

          {/* Enhanced Subtitle */}
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

          {/* Enhanced CTA Buttons */}
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
            
            <motion.button 
              className={`group border-2 ${isDarkTheme ? 'border-slate-500 hover:border-blue-400 text-white hover:bg-blue-500/10' : 'border-gray-300 hover:border-blue-500 text-gray-700 hover:bg-blue-50'} px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl text-base md:text-lg font-bold transition-all duration-300 backdrop-blur-sm relative overflow-hidden`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <motion.svg 
                  className="w-4 h-4 md:w-5 md:h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </motion.svg>
                Watch Demo
              </span>
            </motion.button>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl lg:max-w-5xl mx-auto px-4"
            variants={itemVariants}
          >
            {[
              { 
                value: "10K+", 
                label: "Active Users",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                ),
                color: "from-blue-400 to-blue-600"
              },
              { 
                value: "50K+", 
                label: "Transactions Tracked",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                ),
                color: "from-purple-400 to-purple-600"
              },
              { 
                value: "99.9%", 
                label: "Uptime",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                ),
                color: "from-green-400 to-green-600"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className={`group text-center p-4 md:p-8 bg-gradient-to-br ${theme.cardBg} border ${theme.border} rounded-2xl md:rounded-3xl backdrop-blur-md hover:shadow-lg md:hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 1 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
                <motion.div 
                  className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text mb-3 md:mb-4 flex justify-center`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className={`text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: index * 0.2 + 1.3 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-600'} font-medium text-sm md:text-base`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className={`bg-gradient-to-r ${isDarkTheme ? 'from-slate-800/50 to-slate-700/50 border-slate-600' : 'from-white/80 to-gray-50/80 border-gray-300'} border rounded-2xl md:rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-xl`}>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Ready to Take Control?
            </h2>
            <p className={`text-lg md:text-xl ${isDarkTheme ? 'text-slate-300' : 'text-gray-600'} mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Join thousands of users who trust MoneyMate to keep their finances organized and transparent.
            </p>
            <motion.button 
              className={`bg-gradient-to-r ${currentTheme.accent} hover:shadow-xl px-8 py-3 md:px-10 md:py-4 text-lg md:text-xl font-bold rounded-xl shadow-lg transition-all duration-300 text-white`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${isDarkTheme ? 'border-slate-800' : 'border-gray-200'} py-6 md:py-8`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} text-sm md:text-base`}>
            &copy; 2024 MoneyMate. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 md:mb-12 mb-10"
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
              className={`w-1 h-3 md:w-1.5 md:h-4 bg-gradient-to-b ${theme.accent} rounded-full mt-2`}
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