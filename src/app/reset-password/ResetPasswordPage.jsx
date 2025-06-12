'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Eye, EyeOff, Lock, Shield, ArrowLeft, CheckCircle } from 'lucide-react'

const resetPasswordSchema = z.object({
  verifyCode: z.string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const newPassword = watch('newPassword')
  const verifyCode = watch('verifyCode')

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    if (newPassword.length >= 8) strength++
    if (/[a-z]/.test(newPassword)) strength++
    if (/[A-Z]/.test(newPassword)) strength++
    if (/[0-9]/.test(newPassword)) strength++
    if (/[@$!%*?&]/.test(newPassword)) strength++
    
    setPasswordStrength(strength)
  }, [newPassword])

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password')
    }
  }, [email, router])

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
  }

  const currentTheme = themeClasses[theme]

  const getStrengthColor = () => {
    const colors = [
      'bg-gray-300',
      'bg-red-500',
      'bg-orange-500', 
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500'
    ]
    return colors[passwordStrength] || 'bg-gray-300'
  }

  const getStrengthText = () => {
    const texts = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return texts[passwordStrength] || ''
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verifyCode: data.verifyCode,
          newPassword: data.newPassword
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsPasswordReset(true)
      } else {
        setError('root', {
          type: 'manual',
          message: result.error || 'Password reset failed'
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

  if (isPasswordReset) {
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
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>Password Reset Successfully!</h1>
          
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-6`}>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>

          <motion.button
            onClick={() => router.push('/sign-in')}
            className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Sign In
          </motion.button>
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
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>Reset Password</h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
            Enter the code sent to your email and create a new password
          </p>
          <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium break-all`}>
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Verification Code Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Verification Code
            </label>
            <input
              {...register('verifyCode')}
              type="text"
              maxLength={6}
              className={`w-full px-4 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText} text-center text-2xl font-mono tracking-widest`}
              placeholder="000000"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                e.target.value = value
              }}
            />
            {errors.verifyCode && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.verifyCode.message}
              </motion.p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              New Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Enter new password"
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
            {newPassword && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor() : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${getStrengthColor() === 'bg-green-500' ? 'text-green-600' : 'text-orange-600'}`}>
                  {getStrengthText()}
                </p>
              </div>
            )}
            
            {errors.newPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.newPassword.message}
              </motion.p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                placeholder="Confirm new password"
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
            disabled={isLoading || !verifyCode || verifyCode.length !== 6}
            className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
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
            Remember your password?{' '}
            <Link
              href="/sign-in"
              className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium transition-colors`}
            >
              Sign in
            </Link>
          </p>
          
          <Link
            href="/forgot-password"
            className={`inline-flex items-center text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Forgot Password
          </Link>
        </div>
      </motion.div>
    </div>
  )
}