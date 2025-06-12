'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  User, 
  Edit, 
  Camera, 
  Mail, 
  Key, 
  Save, 
  X, 
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

const profileSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters")
    .trim()
})

const passwordSchema = z.object({
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const router = useRouter()
  const { theme } = useTheme()
  const { user, logout, refreshUser } = useUser()

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue: setProfileValue,
    setError: setProfileError,
    clearErrors: clearProfileErrors
  } = useForm({
    resolver: zodResolver(profileSchema)
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    setError: setPasswordError,
    clearErrors: clearPasswordErrors,
    watch: watchPassword
  } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const newPassword = watchPassword('newPassword')

  const themeClasses = {
    dark: {
      bg: "from-slate-900 via-slate-800 to-slate-900",
      cardBg: "bg-slate-800/50",
      text: "text-white",
      textSecondary: "text-slate-400",
      inputBg: "bg-slate-700/50",
      inputBorder: "border-slate-600",
      inputText: "text-white placeholder-slate-400",
      accent: "from-blue-400 to-purple-400",
      hover: "hover:bg-slate-700/50",
      border: "border-slate-600/50"
    },
    light: {
      bg: "from-gray-50 via-blue-50 to-purple-50",
      cardBg: "bg-white/70",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      inputBg: "bg-white/70",
      inputBorder: "border-gray-300",
      inputText: "text-gray-900 placeholder-gray-500",
      accent: "from-blue-600 to-purple-600",
      hover: "hover:bg-gray-50",
      border: "border-gray-200"
    }
  }

  const currentTheme = themeClasses[theme]

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

  // Set initial form values
  useEffect(() => {
    if (user) {
      setProfileValue('username', user.username)
    }
    console.log('Profile form initialized with user data:', user)
  }, [user, setProfileValue])

  // Handle profile picture upload
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please select a valid image file (JPEG, JPG, PNG, or GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    setIsUploadingImage(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/auth/user/profile-picture/${user.id}`, {
        method: 'PUT',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        await refreshUser() // Refresh user data
        setSuccess('Profile picture updated successfully!')
        setPreviewUrl(null)
      } else {
        setError(result.error || 'Failed to update profile picture')
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Profile picture upload error:', error)
      setError('An error occurred while updating profile picture')
      setPreviewUrl(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle profile update
  const onUpdateProfile = async (data) => {
    setIsUpdatingProfile(true)
    clearProfileErrors()
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        await refreshUser() // Refresh user data
        setSuccess('Profile updated successfully!')
        setEditMode(false)
      } else {
        setProfileError('username', {
          type: 'manual',
          message: result.error || 'Failed to update profile'
        })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setProfileError('username', {
        type: 'manual',
        message: 'An error occurred while updating profile'
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle password update
  const onUpdatePassword = async (data) => {
    setIsUpdatingPassword(true)
    clearPasswordErrors()
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: data.newPassword })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Password updated successfully!')
        resetPassword()
        setActiveTab('profile')
      } else {
        setPasswordError('newPassword', {
          type: 'manual',
          message: result.error || 'Failed to update password'
        })
      }
    } catch (error) {
      console.error('Password update error:', error)
      setPasswordError('newPassword', {
        type: 'manual',
        message: 'An error occurred while updating password'
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      router.push('/')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get password strength color and text
  const getPasswordStrength = () => {
    const colors = ['bg-gray-300', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const texts = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return {
      color: colors[passwordStrength] || 'bg-gray-300',
      text: texts[passwordStrength] || ''
    }
  }

  const strengthInfo = getPasswordStrength()

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} pt-20 lg:pt-24 p-4 md:p-6 lg:p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.push('/dashboard')}
                className={`flex items-center gap-2 ${currentTheme.text} ${currentTheme.hover} px-3 py-2 rounded-lg transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text}`}>
                  Profile Settings
                </h1>
                <p className={`${currentTheme.textSecondary}`}>
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 mb-6`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="relative">
                  {previewUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : user?.profilePicture ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentTheme.accent} flex items-center justify-center border-4 border-blue-500 shadow-lg`}>
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>
                  
                  {/* Upload Loading */}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-2xl font-bold ${currentTheme.text} mb-2`}>
                  {user?.username}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  <span className={`${currentTheme.textSecondary}`}>{user?.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className={`text-sm ${currentTheme.textSecondary}`}>
                    Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        resetProfile()
                        setProfileValue('username', user?.username || '')
                        clearProfileErrors()
                      }}
                      className={`flex items-center gap-2 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-600 dark:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
                  </div>
                  <button onClick={() => setSuccess('')} className="text-green-600 dark:text-green-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-1 mb-6`}
          >
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? `bg-gradient-to-r ${currentTheme.accent} text-white shadow-md`
                    : `${currentTheme.text} ${currentTheme.hover}`
                }`}
              >
                <User className="w-4 h-4" />
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'security'
                    ? `bg-gradient-to-r ${currentTheme.accent} text-white shadow-md`
                    : `${currentTheme.text} ${currentTheme.hover}`
                }`}
              >
                <Shield className="w-4 h-4" />
                Security
              </button>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}
              >
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-6`}>
                  Profile Information
                </h3>

                {editMode ? (
                  <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Username
                      </label>
                      <input
                        {...registerProfile('username')}
                        className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                        placeholder="Enter your username"
                      />
                      {profileErrors.username && (
                        <p className="text-red-500 text-sm mt-1">{profileErrors.username.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg opacity-50 cursor-not-allowed ${currentTheme.inputText}`}
                      />
                      <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false)
                          resetProfile()
                          setProfileValue('username', user?.username || '')
                          clearProfileErrors()
                        }}
                        className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                      >
                        {isUpdatingProfile ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Updating...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2 inline" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Username</div>
                      <div className={`w-2/3 ${currentTheme.text}`}>{user?.username}</div>
                    </div>
                    <div className="flex border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Email</div>
                      <div className={`w-2/3 ${currentTheme.text}`}>{user?.email}</div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3 font-medium text-gray-500 dark:text-gray-400">Member Since</div>
                      <div className={`w-2/3 ${currentTheme.text}`}>
                        {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}
              >
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-6`}>
                  Security Settings
                </h3>

                <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword('newPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full px-3 py-2 pr-10 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded ${i < passwordStrength ? strengthInfo.color : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${strengthInfo.color === 'bg-green-500' ? 'text-green-600' : 'text-orange-600'}`}>
                          {strengthInfo.text}
                        </p>
                      </div>
                    )}

                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full px-3 py-2 pr-10 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className={`w-full bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                  >
                    {isUpdatingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating Password...
                      </div>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2 inline" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  )
}