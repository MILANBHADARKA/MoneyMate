'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '@/schemas/signUpSchema'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(signUpSchema)
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        setError('root', {
          type: 'manual',
          message: result.error || 'Sign up failed'
        })
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength()
  const strengthColors = ['bg-gray-300', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  const strengthTexts = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

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
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>Create Account</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Join MoneyMate to start tracking your finances
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('username')}
                type="text"
                className={`w-full pl-10 pr-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.username.message}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
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
                placeholder="Enter your email"
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

          {/* Password Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${i < passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${strengthColors[passwordStrength] === 'bg-green-500' ? 'text-green-600' : 'text-orange-600'}`}>
                  {strengthTexts[passwordStrength]}
                </p>
              </div>
            )}
            
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
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

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium transition-colors`}
            >
              Sign in
            </Link>
          </p>
          
          <Link
            href="/"
            className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
