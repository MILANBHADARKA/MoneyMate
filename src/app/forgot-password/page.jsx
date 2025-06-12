'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" })
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const router = useRouter()
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const themeClasses = {
    dark: {
      bg: "from-slate-900 via-slate-800 to-slate-900",
      cardBg: "from-slate-800/80 to-slate-700/80",
      text: "text-white",
      inputBg: "bg-slate-700/50",
      inputBorder: "border-slate-600",
      inputText: "text-white placeholder-slate-400",
      accent: "from-blue-400 to-purple-400"
    },
    light: {
      bg: "from-gray-50 via-blue-50 to-purple-50",
      cardBg: "from-white/90 to-gray-50/90",
      text: "text-gray-900",
      inputBg: "bg-white/70",
      inputBorder: "border-gray-300",
      inputText: "text-gray-900 placeholder-gray-500",
      accent: "from-blue-600 to-purple-600"
    }
  };

  const currentTheme = themeClasses[theme];

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setEmailAddress(data.email)
        setIsEmailSent(true)
      } else {
        setError('email', {
          type: 'manual',
          message: result.error || 'Failed to send reset email'
        })
      }
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToReset = () => {
    router.push(`/reset-password?email=${encodeURIComponent(emailAddress)}`)
  }

  if (isEmailSent) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-20 w-96 h-96 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-500/10' : 'from-blue-400/20'} rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tl ${theme === 'dark' ? 'from-purple-500/10' : 'from-purple-400/20'} rounded-full blur-3xl`}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-md bg-gradient-to-br ${currentTheme.cardBg} backdrop-blur-md border ${theme === 'dark' ? 'border-slate-600/50' : 'border-gray-300/50'} rounded-2xl shadow-xl p-8 text-center`}
        >
          <motion.div
            className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                '0 0 20px 8px rgba(34, 197, 94, 0.1)',
                '0 0 0 0 rgba(34, 197, 94, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>Check Your Email</h1>
          
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
            We've sent a password reset code to:
          </p>
          
          <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium mb-6 break-all`}>
            {emailAddress}
          </p>

          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} text-sm mb-8`}>
            Enter the 6-digit code from the email to reset your password.
          </p>

          <motion.button
            onClick={handleContinueToReset}
            className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Reset Password
          </motion.button>

          <Link
            href="/sign-in"
            className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 right-20 w-96 h-96 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-500/10' : 'from-blue-400/20'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tl ${theme === 'dark' ? 'from-purple-500/10' : 'from-purple-400/20'} rounded-full blur-3xl`}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md bg-gradient-to-br ${currentTheme.cardBg} backdrop-blur-md border ${theme === 'dark' ? 'border-slate-600/50' : 'border-gray-300/50'} rounded-2xl shadow-xl p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className={`w-16 h-16 bg-gradient-to-br ${currentTheme.accent} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Send className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>Forgot Password?</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            No worries! Enter your email and we'll send you a reset code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending Reset Code...
              </div>
            ) : (
              'Send Reset Code'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/sign-in"
            className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
