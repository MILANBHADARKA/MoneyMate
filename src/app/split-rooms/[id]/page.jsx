'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/context/ThemeContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  ArrowLeft, 
  Plus,
  DollarSign,
  Users,
  Receipt,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  X,
  Settings,
  LogOut,
  Copy,
  Check,
  UserCheck,
  UserX,
  Calculator,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Share2
} from 'lucide-react'

const expenseSchema = z.object({
  amount: z.number()
    .min(0.01, "Amount must be greater than 0")
    .max(9999999, "Amount is too large"),
  reason: z.string()
    .max(200, "Reason must be less than 200 characters")
    .optional(),
  users: z.array(z.string())
    .min(1, "At least one user must be selected")
})

const roomEditSchema = z.object({
  name: z.string()
    .min(1, "Room name is required")
    .max(50, "Room name must be less than 50 characters")
    .trim()
})

export default function SplitRoomDetailPage() {
  const [room, setRoom] = useState(null)
  const [users, setUsers] = useState([])
  const [balances, setBalances] = useState({ toReceive: [], toPay: [], settled: [] })
  const [summary, setSummary] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false)
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false)
  const [isCreatingExpense, setIsCreatingExpense] = useState(false)
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false)
  const [isLeavingRoom, setIsLeavingRoom] = useState(false)
  const [copiedRoomId, setCopiedRoomId] = useState(false)
  const [activeTab, setActiveTab] = useState('expenses') // expenses, balances, members, summary
  const [expandedExpenses, setExpandedExpenses] = useState({})

  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { theme } = useTheme()

  const {
    register: registerExpense,
    handleSubmit: handleSubmitExpense,
    formState: { errors: expenseErrors },
    reset: resetExpense,
    setError: setExpenseError,
    clearErrors: clearExpenseErrors,
    watch: watchExpense,
    setValue: setExpenseValue
  } = useForm({
    resolver: zodResolver(expenseSchema)
  })

  const {
    register: registerRoom,
    handleSubmit: handleSubmitRoom,
    formState: { errors: roomErrors },
    reset: resetRoom,
    setError: setRoomError,
    clearErrors: clearRoomErrors,
    setValue: setRoomValue
  } = useForm({
    resolver: zodResolver(roomEditSchema)
  })

  const selectedUsers = watchExpense('users') || []

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

  // Fetch room data with populated expenses
  const fetchRoomData = async () => {
    try {
      setIsLoading(true)
      
      // Get current user info first
      const userResponse = await fetch('/api/auth/user')
      const userResult = await userResponse.json()
      if (userResult.success) {
        setCurrentUser(userResult.user)
      }
      
      // Fetch room details, users, balances, and summary
      const [roomRes, usersRes, balancesRes, summaryRes] = await Promise.all([
        fetch(`/api/split-room/${id}?type=room-details`),
        fetch(`/api/split-room/${id}?type=room-users`),
        fetch(`/api/split-room/${id}?type=calculate-balance`),
        fetch(`/api/split-room/${id}?type=room-summary`)
      ])

      const [roomResult, usersResult, balancesResult, summaryResult] = await Promise.all([
        roomRes.json(),
        usersRes.json(),
        balancesRes.json(),
        summaryRes.json()
      ])

      console.log('Room data:', roomResult, usersResult, balancesResult, summaryResult)

      if (roomResult.success) setRoom(roomResult.splitRoom)
      if (usersResult.success) setUsers(usersResult.users)
      if (balancesResult.success) setBalances(balancesResult.balances)
      if (summaryResult.success) setSummary(summaryResult)

      if (!roomResult.success && roomRes.status !== 404) {
        setError(roomResult.error || 'Failed to fetch room details')
      }
    } catch (error) {
      console.error('Fetch room data error:', error)
      setError('An error occurred while fetching room data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchRoomData()
    }
  }, [id])

  // Helper functions
  const isCurrentUserPayer = (expense) => {
    return currentUser && expense.paidBy && expense.paidBy._id === currentUser._id
  }

  const toggleExpenseDetails = (expenseId) => {
    setExpandedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }))
  }

  // Create expense
  const onCreateExpense = async (data) => {
    setIsCreatingExpense(true)
    clearExpenseErrors()
    try {
      const response = await fetch(`/api/split-expense?roomId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setIsAddExpenseModalOpen(false)
        resetExpense()
        fetchRoomData() // Refresh data
        setError('')
      } else {
        setExpenseError('amount', {
          type: 'manual',
          message: result.error || 'Failed to create expense'
        })
      }
    } catch (error) {
      console.error('Create expense error:', error)
      setExpenseError('amount', {
        type: 'manual',
        message: 'An error occurred while creating expense'
      })
    } finally {
      setIsCreatingExpense(false)
    }
  }

  // Update room
  const onUpdateRoom = async (data) => {
    setIsUpdatingRoom(true)
    clearRoomErrors()
    try {
      const response = await fetch(`/api/split-room/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setRoom(result.splitRoom)
        setIsEditRoomModalOpen(false)
        resetRoom()
        setError('')
      } else {
        setRoomError('name', {
          type: 'manual',
          message: result.error || 'Failed to update room'
        })
      }
    } catch (error) {
      console.error('Update room error:', error)
      setRoomError('name', {
        type: 'manual',
        message: 'An error occurred while updating room'
      })
    } finally {
      setIsUpdatingRoom(false)
    }
  }

  // Leave room
  const handleLeaveRoom = async () => {
    if (!confirm('Are you sure you want to leave this room? This action cannot be undone.')) return
    
    setIsLeavingRoom(true)
    try {
      const response = await fetch(`/api/split-room/${id}?type=leave-room`)
      const result = await response.json()

      if (result.success) {
        router.push('/split-rooms')
      } else {
        setError(result.error || 'Failed to leave room')
      }
    } catch (error) {
      console.error('Leave room error:', error)
      setError('An error occurred while leaving room')
    } finally {
      setIsLeavingRoom(false)
    }
  }

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(id)
    setCopiedRoomId(true)
    setTimeout(() => setCopiedRoomId(false), 2000)
  }

  // Open edit room modal
  const openEditRoomModal = () => {
    if (room) {
      setRoomValue('name', room.name)
      clearRoomErrors()
      setIsEditRoomModalOpen(true)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} pt-20 lg:pt-24 p-4 md:p-6 lg:p-8`}>
          <div className="max-w-7xl mx-auto">
            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-8`}>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className={`ml-3 ${currentTheme.text}`}>Loading room details...</span>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && !room) {
    return (
      <ProtectedRoute>
        <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} pt-20 lg:pt-24 p-4 md:p-6 lg:p-8`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
            <button
              onClick={() => router.push('/split-rooms')}
              className={`flex items-center gap-2 ${currentTheme.text} ${currentTheme.hover} px-4 py-2 rounded-lg transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Split Rooms
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} pt-20 lg:pt-24 p-4 md:p-6 lg:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.push('/split-rooms')}
                className={`flex items-center gap-2 ${currentTheme.text} ${currentTheme.hover} px-3 py-2 rounded-lg transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Rooms
              </button>
              
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {room?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
                    {room?.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className={`${currentTheme.textSecondary} text-sm`}>
                      Room ID: {id}
                    </p>
                    <button
                      onClick={copyRoomId}
                      className={`p-1 ${currentTheme.hover} rounded transition-colors`}
                    >
                      {copiedRoomId ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4" />
                    <span className={`text-sm ${currentTheme.textSecondary}`}>
                      {users.length} {users.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRoomSettingsOpen(true)}
                  className={`p-2 ${currentTheme.hover} rounded-lg transition-colors`}
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={copyRoomId}
                  className={`flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors`}
                >
                  <Share2 className="w-4 h-4" />
                  Share ID
                </button>
                
                <button
                  onClick={() => {
                    clearExpenseErrors()
                    resetExpense()
                    setExpenseValue('users', [])
                    setIsAddExpenseModalOpen(true)
                  }}
                  className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-1`}>
              <div className="flex">
                {[{
                  id: 'expenses',
                  label: 'Expenses',
                  icon: Receipt
                },
                {
                  id: 'balances',
                  label: 'Balances',
                  icon: TrendingUp
                },
                {
                  id: 'summary',
                  label: 'Summary',
                  icon: Calculator
                },
                {
                  id: 'members',
                  label: 'Members',
                  icon: Users
                }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${currentTheme.accent} text-white shadow-md`
                        : `${currentTheme.text} ${currentTheme.hover}`
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                    <Receipt className="w-5 h-5" />
                    Expense History
                  </h3>
                  
                  {room?.expenses && room.expenses.length > 0 ? (
                    <div className="space-y-4">
                      {room.expenses.map((expense) => {
                        // Handle both ObjectId strings and populated objects
                        const expenseData = typeof expense === 'string' ? null : expense
                        
                        // Skip if expense is not populated
                        if (!expenseData || !expenseData._id) {
                          return null
                        }
                        
                        const isPaidByMe = currentUser && expenseData.paidBy && (
                          typeof expenseData.paidBy === 'string' 
                            ? expenseData.paidBy === currentUser._id 
                            : expenseData.paidBy._id === currentUser._id
                        )
                        const isExpanded = expandedExpenses[expenseData._id] || false
                        
                        return (
                          <div 
                            key={expenseData._id} 
                            className={`border-l-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                              isPaidByMe ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' : 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="flex-1">
                                  <h4 className={`font-medium text-lg ${currentTheme.text}`}>
                                    {expenseData.reason || "Expense"}
                                  </h4>
                                  <p className={`text-sm flex items-center gap-1 ${isPaidByMe ? 'text-green-700 dark:text-green-400' : 'text-purple-700 dark:text-purple-400'}`}>
                                    <span className="font-medium">
                                      {isPaidByMe ? 'You paid' : `Paid by ${
                                        expenseData.paidBy?.username || 
                                        (typeof expenseData.paidBy === 'string' ? 'Loading...' : 'Unknown')
                                      }`}
                                    </span>
                                  </p>
                                  <div 
                                    className="flex items-center mt-2 cursor-pointer hover:opacity-75 transition-opacity" 
                                    onClick={() => toggleExpenseDetails(expenseData._id)}
                                  >
                                    <Users className="w-4 h-4 mr-1" />
                                    <span className={`text-sm ${currentTheme.textSecondary}`}>
                                      Split among {expenseData.users?.length || 0} people
                                    </span>
                                    {isExpanded ? 
                                      <ChevronUp className="w-4 h-4 ml-1" /> : 
                                      <ChevronDown className="w-4 h-4 ml-1" />
                                    }
                                  </div>
                                  <p className={`text-xs ${currentTheme.textSecondary} flex items-center mt-2`}>
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDate(expenseData.createdAt)}
                                  </p>
                                </div>
                                
                                <div className={`text-right px-4 py-3 rounded-lg ${
                                  isPaidByMe ? 'bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200' : 'bg-purple-100 dark:bg-purple-800/30 text-purple-800 dark:text-purple-200'
                                }`}>
                                  <p className="font-bold text-lg">₹{expenseData.amount || 0}</p>
                                  <p className="text-xs font-medium">
                                    {isPaidByMe ? 'You paid' : 'You owe a share'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Participants list */}
                              {isExpanded && expenseData.users && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                  <p className={`text-sm font-medium ${currentTheme.text} mb-3`}>Participants:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {expenseData.users.map((user, index) => {
                                      // Handle both ObjectId strings and populated user objects
                                      const userData = typeof user === 'string' ? 
                                        users.find(u => u._id === user) || { _id: user, username: 'Loading...' } : 
                                        user
                                      const isCurrentUser = currentUser && userData._id === currentUser._id
                                      
                                      return (
                                        <div 
                                          key={userData._id || index} 
                                          className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                            isCurrentUser 
                                              ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200' 
                                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                          }`}
                                        >
                                          <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-xs mr-2">
                                            {userData.username?.[0]?.toUpperCase() || '?'}
                                          </div>
                                          <span>{isCurrentUser ? 'You' : userData.username}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <p className={`text-xs ${currentTheme.textSecondary} mt-3`}>
                                    Each person pays: ₹{((expenseData.amount || 0) / (expenseData.users?.length || 1)).toFixed(2)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      }).filter(Boolean).reverse()}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                        <Receipt className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className={`${currentTheme.text} text-lg mb-2`}>No expenses yet</p>
                      <p className={`${currentTheme.textSecondary} mb-6`}>
                        Add your first expense to get started!
                      </p>
                      <button 
                        onClick={() => {
                          clearExpenseErrors()
                          resetExpense()
                          setExpenseValue('users', [])
                          setIsAddExpenseModalOpen(true)
                        }}
                        className={`bg-gradient-to-r ${currentTheme.accent} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                      >
                        Add First Expense
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'balances' && (
              <motion.div
                key="balances"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5" />
                    Your Balances
                  </h3>
                  
                  {balances ? (
                    <div className="space-y-6">
                      {/* Money to Receive */}
                      {balances.toReceive?.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="text-green-700 dark:text-green-400 font-medium mb-3 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Money to Receive
                          </h4>
                          <div className="space-y-2">
                            {balances.toReceive.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-green-100 dark:border-green-800"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center text-sm font-semibold">
                                    {item.user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <p className={`font-medium ${currentTheme.text}`}>{item.user.username}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">₹{item.amount.toFixed(2)}</p>
                                  <p className="text-xs text-gray-500">owes you</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Money to Pay */}
                      {balances.toPay?.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                          <h4 className="text-red-600 dark:text-red-400 font-medium mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Money to Pay
                          </h4>
                          <div className="space-y-2">
                            {balances.toPay.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-red-100 dark:border-red-800"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-700 flex items-center justify-center text-sm font-semibold">
                                    {item.user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <p className={`font-medium ${currentTheme.text}`}>{item.user.username}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-red-600 dark:text-red-400 text-lg">₹{item.amount.toFixed(2)}</p>
                                  <p className="text-xs text-gray-500">you owe</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Settled Accounts */}
                      {balances.settled?.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className={`${currentTheme.text} font-medium mb-3 flex items-center gap-2`}>
                            <UserCheck className="w-4 h-4" />
                            Settled Accounts
                          </h4>
                          <div className="space-y-2">
                            {balances.settled.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-semibold">
                                    {item.user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <p className={`font-medium ${currentTheme.text}`}>{item.user.username}</p>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                  <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Settled</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* No Balances */}
                      {(!balances.toReceive?.length && !balances.toPay?.length && !balances.settled?.length) && (
                        <div className="text-center py-12">
                          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className={`${currentTheme.text} text-lg mb-2`}>No balances yet</p>
                          <p className={`${currentTheme.textSecondary}`}>
                            Add expenses to see your balances with other members.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className={`${currentTheme.textSecondary}`}>Balance data is not available.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Room Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Total Expenses</p>
                        <p className={`text-2xl font-bold ${currentTheme.text}`}>
                          {formatCurrency(summary?.room?.totalExpense || 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Members</p>
                        <p className={`text-2xl font-bold ${currentTheme.text}`}>{users.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Transactions</p>
                        <p className={`text-2xl font-bold ${currentTheme.text}`}>{room?.expenses?.length || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Summary */}
                {summary?.users && (
                  <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                    <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Member Summary</h3>
                    <div className="space-y-3">
                      {summary.users.map((userSummary) => (
                        <div key={userSummary.user._id} className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${currentTheme.accent} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-semibold text-sm">
                                {userSummary.user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className={`font-medium ${currentTheme.text}`}>
                              {userSummary.user.username}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm ${currentTheme.textSecondary}`}>
                              Paid: {formatCurrency(userSummary.paid)} | Owes: {formatCurrency(userSummary.owes)}
                            </div>
                            <div className={`font-semibold ${
                              userSummary.netBalance >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {userSummary.netBalance >= 0 ? '+' : ''}{formatCurrency(userSummary.netBalance)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Room Members</h3>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${currentTheme.accent} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className={`font-medium ${currentTheme.text}`}>
                              {user.username}
                            </span>
                            <p className={`text-sm ${currentTheme.textSecondary}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user._id === room?.createdBy && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                              Admin
                            </span>
                          )}
                          <span className="text-sm font-medium text-green-500">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Expense Modal */}
        <AnimatePresence>
          {isAddExpenseModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsAddExpenseModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Add Expense</h2>
                  <button
                    onClick={() => setIsAddExpenseModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitExpense(onCreateExpense)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Amount
                    </label>
                    <input
                      {...registerExpense('amount', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter amount"
                    />
                    {expenseErrors.amount && (
                      <p className="text-red-500 text-sm mt-1">{expenseErrors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Reason (Optional)
                    </label>
                    <textarea
                      {...registerExpense('reason')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter reason"
                      rows={2}
                    />
                    {expenseErrors.reason && (
                      <p className="text-red-500 text-sm mt-1">{expenseErrors.reason.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Split Among
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <label key={user._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={user._id}
                            {...registerExpense('users')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 bg-gradient-to-br ${currentTheme.accent} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-semibold text-xs">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className={currentTheme.text}>{user.username}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {expenseErrors.users && (
                      <p className="text-red-500 text-sm mt-1">{expenseErrors.users.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddExpenseModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingExpense}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isCreatingExpense ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Expense'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room Settings Modal */}
        <AnimatePresence>
          {isRoomSettingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsRoomSettingsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Room Settings</h2>
                  <button
                    onClick={() => setIsRoomSettingsOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsRoomSettingsOpen(false)
                      openEditRoomModal()
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${currentTheme.hover} rounded-lg transition-colors text-left`}
                  >
                    <Edit3 className="w-5 h-5" />
                    <span className={currentTheme.text}>Edit Room Name</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRoomSettingsOpen(false)
                      handleLeaveRoom()
                    }}
                    disabled={isLeavingRoom}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{isLeavingRoom ? 'Leaving...' : 'Leave Room'}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Room Modal */}
        <AnimatePresence>
          {isEditRoomModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditRoomModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Edit Room</h2>
                  <button
                    onClick={() => setIsEditRoomModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitRoom(onUpdateRoom)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Room Name
                    </label>
                    <input
                      {...registerRoom('name')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter room name"
                    />
                    {roomErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{roomErrors.name.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditRoomModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingRoom}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isUpdatingRoom ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Room'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  )
}