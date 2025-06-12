'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Loader = ({ text = "Loading...", variant = 'default', size = 'medium' }) => {
  const { theme } = useTheme();
  const [currentIcon, setCurrentIcon] = useState(0);
  const [dots, setDots] = useState('');

  const sizeClasses = {
    small: { container: 'w-6 h-6', dot: 'w-1.5 h-1.5' },
    medium: { container: 'w-8 h-8', dot: 'w-2 h-2' },
    large: { container: 'w-12 h-12', dot: 'w-3 h-3' }
  }

  const themeClasses = {
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      accent: "bg-blue-600",
      dots: "bg-blue-600"
    },
    dark: {
      bg: "bg-slate-900",
      text: "text-white",
      accent: "bg-blue-400",
      dots: "bg-blue-400"
    }
  }

  const currentTheme = themeClasses[theme]
  const currentSize = sizeClasses[size]

  // Financial icons that rotate
  const financialIcons = [
    // Dollar sign
    <motion.svg
      key="dollar"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
    >
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </motion.svg>,
    // Chart
    <motion.svg
      key="chart"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
    >
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </motion.svg>,
    // Credit Card
    <motion.svg
      key="card"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
    >
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </motion.svg>,
    // Wallet
    <motion.svg
      key="wallet"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
    >
      <path fillRule="evenodd" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
    </motion.svg>
  ];

  const [innerWidth, setInnerWidth] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);

      // Update dimensions on resize
      const handleResize = () => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Icon rotation effect
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % financialIcons.length);
    }, 1200);
    return () => clearInterval(iconInterval);
  }, []);

  // Animated dots effect
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  // MoneyMate themed loader
  const MoneyMateLoader = () => (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating gradient ring */}
      <motion.div
        className={`absolute w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-0.5`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className={`w-full h-full ${currentTheme.bg} rounded-full`} />
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        className={`absolute w-12 h-12 border-2 border-transparent bg-gradient-to-r ${currentTheme.accent} rounded-full opacity-60`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.2, 0.6]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Center icon container */}
      <motion.div
        className={`relative w-10 h-10 ${currentTheme.accent} bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 to-slate-700' : 'from-white to-gray-50'} rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'shadow-blue-500/25' : 'shadow-blue-500/20'} border ${theme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}
        animate={{
          boxShadow: [
            theme === 'dark' ? '0 0 0 0 rgba(59, 130, 246, 0.4)' : '0 0 0 0 rgba(59, 130, 246, 0.3)',
            theme === 'dark' ? '0 0 20px 8px rgba(59, 130, 246, 0.1)' : '0 0 20px 8px rgba(59, 130, 246, 0.1)',
            theme === 'dark' ? '0 0 0 0 rgba(59, 130, 246, 0.4)' : '0 0 0 0 rgba(59, 130, 246, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIcon}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {financialIcons[currentIcon]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Orbiting mini particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${currentTheme.accent} rounded-full`}
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1]
          }}
          transition={{
            rotate: { duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, delay: i * 0.3 }
          }}
          style={{
            transformOrigin: `${25 + i * 5}px ${25 + i * 5}px`
          }}
        />
      ))}
    </div>
  );

  // Minimal clean loader
  const MinimalLoader = () => (
    <div className="relative w-12 h-12">
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${currentTheme.accent} opacity-20`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${currentTheme.accent}`}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <div className={`absolute inset-2 rounded-full ${currentTheme.bg} flex items-center justify-center`}>
        <motion.div
          className={`w-2 h-2 bg-gradient-to-r ${currentTheme.accent} rounded-full`}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );

  const loaderVariants = {
    default: MoneyMateLoader,
    minimal: MinimalLoader
  };

  const LoaderComponent = loaderVariants[variant] || MoneyMateLoader;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${currentTheme.bg} backdrop-blur-sm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute top-20 right-20 w-64 h-64 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-500/10' : 'from-blue-400/20'} rounded-full blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr ${theme === 'dark' ? 'from-purple-500/10' : 'from-purple-400/20'} rounded-full blur-3xl`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main loader */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="relative z-10"
      >
        <LoaderComponent />
      </motion.div>

      {/* Enhanced text with animated dots */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className={`font-semibold text-lg ${currentTheme.text} flex items-center justify-center`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
          <span className="inline-block w-8 text-left">
            {dots}
          </span>
        </motion.p>

        {/* MoneyMate branding */}
        <motion.div
          className="mt-4 flex items-center justify-center space-x-2 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className={`w-4 h-4 bg-gradient-to-r ${currentTheme.accent} rounded-md flex items-center justify-center`}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg
              className="w-2 h-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M4 20V4l8 9 8-9v16" />
            </svg>
          </motion.div>
          <span className={`text-sm font-medium ${currentTheme.text}`}>MoneyMate</span>
        </motion.div>
      </motion.div>

      {/* Floating financial particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute text-lg ${theme === 'dark' ? 'text-green-400/30' : 'text-green-600/30'} font-bold pointer-events-none`}
          initial={{
            x: Math.random() * innerWidth,
            y: innerHeight + 50,
            opacity: 0
          }}
          animate={{
            y: -50,
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          {['$', '€', '£', '¥', '₹', '₿', '₽', '¢'][i]}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Export pre-configured variants
export const MoneyMateLoader = (props) => <Loader variant="default" {...props} />;
export const MinimalLoader = (props) => <Loader variant="minimal" {...props} />;

export default Loader;
