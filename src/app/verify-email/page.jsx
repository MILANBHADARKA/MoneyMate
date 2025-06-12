'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Mail, Shield, ArrowLeft, RefreshCw } from 'lucide-react'

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { theme, toggleTheme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm({
    resolver: zodResolver(verifySchema)
  })

  const code = watch('code')

  useEffect(() => {
    if (!email) {
      router.push('/sign-up')
    }
  }, [email, router])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

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
    clearErrors()

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verifyCode: data.code
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push('/sign-in?verified=true')
      } else {
        setError('code', {
          type: 'manual',
          message: result.error || 'Invalid verification code'
        })
      }
    } catch (error) {
      setError('code', {
        type: 'manual',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.success) {
        setResendTimer(60) // 60 second cooldown
      } else {
        setError('root', {
          type: 'manual',
          message: result.error || 'Failed to resend code'
        })
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
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
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.4)',
                '0 0 20px 8px rgba(59, 130, 246, 0.1)',
                '0 0 0 0 rgba(59, 130, 246, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>Verify Your Email</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
            We've sent a 6-digit verification code to
          </p>
          <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium break-all`}>
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Verification Code
            </label>
            <input
              {...register('code')}
              type="text"
              maxLength={6}
              className={`w-full px-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText} text-center text-2xl font-mono tracking-widest`}
              placeholder="000000"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                e.target.value = value
              }}
              onKeyDown={handleKeyDown}
            />
            {errors.code && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.code.message}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !code || code.length !== 6}
            className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </motion.button>

          {/* Error Message */}
          {errors.root && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-lg"
            >
              <p className="text-red-700 dark:text-red-300 text-sm">{errors.root.message}</p>
            </motion.div>
          )}
        </form>

        {/* Resend Section */}
        <div className="mt-8 text-center space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Didn't receive the code?
          </p>
          
          <motion.button
            onClick={handleResendCode}
            disabled={isResending || resendTimer > 0}
            className={`inline-flex items-center text-sm font-medium transition-colors ${
              resendTimer > 0 
                ? theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                : theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            } disabled:cursor-not-allowed`}
            whileHover={{ scale: resendTimer > 0 ? 1 : 1.05 }}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isResending ? 'animate-spin' : ''}`} />
            {resendTimer > 0 
              ? `Resend in ${resendTimer}s` 
              : isResending 
                ? 'Sending...' 
                : 'Resend Code'
            }
          </motion.button>
          
          <div className="pt-4">
            <Link
              href="/sign-up"
              className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
