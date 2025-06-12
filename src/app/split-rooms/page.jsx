'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Users, 
  DollarSign,
  Calendar,
  AlertCircle,
  Eye,
  UserPlus,
  X,
  Home,
  Receipt,
  TrendingUp
} from 'lucide-react'

const roomSchema = z.object({
  name: z.string()
    .min(1, "Room name is required")
    .max(50, "Room name must be less than 50 characters")
    .trim()
})

const joinRoomSchema = z.object({
  roomId: z.string()
    .min(1, "Room ID is required")
    .trim()
})

export default function SplitRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const { theme } = useTheme()
  const router = useRouter()

  const {
    register: registerRoom,
    handleSubmit: handleSubmitRoom,
    formState: { errors: roomErrors },
    reset: resetRoom,
    setError: setRoomError,
    clearErrors: clearRoomErrors
  } = useForm({
    resolver: zodResolver(roomSchema)
  })

  const {
    register: registerJoin,
    handleSubmit: handleSubmitJoin,
    formState: { errors: joinErrors },
    reset: resetJoin,
    setError: setJoinError,
    clearErrors: clearJoinErrors
  } = useForm({
    resolver: zodResolver(joinRoomSchema)
  })

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

  // Fetch split rooms
  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/split-room')
      const result = await response.json()

      if (result.success) {
        setRooms(result.splitRooms)
      } else {
        if (response.status === 404) {
          setRooms([])
        } else {
          setError(result.error || 'Failed to fetch split rooms')
        }
      }
    } catch (error) {
      console.error('Fetch rooms error:', error)
      setError('An error occurred while fetching split rooms')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Create room
  const onCreateSubmit = async (data) => {
    setIsCreating(true)
    clearRoomErrors()
    try {
      const response = await fetch('/api/split-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setRooms(prev => [...prev, result.splitRoom])
        setIsCreateModalOpen(false)
        resetRoom()
        setError('')
      } else {
        setRoomError('name', {
          type: 'manual',
          message: result.error || 'Failed to create room'
        })
      }
    } catch (error) {
      console.error('Create room error:', error)
      setRoomError('name', {
        type: 'manual',
        message: 'An error occurred while creating room'
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Join room
  const onJoinSubmit = async (data) => {
    setIsJoining(true)
    clearJoinErrors()
    try {
      const response = await fetch('/api/split-room/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setRooms(prev => [...prev, result.splitRoom])
        setIsJoinModalOpen(false)
        resetJoin()
        setError('')
      } else {
        setJoinError('roomId', {
          type: 'manual',
          message: result.error || 'Failed to join room'
        })
      }
    } catch (error) {
      console.error('Join room error:', error)
      setJoinError('roomId', {
        type: 'manual',
        message: 'An error occurred while joining room'
      })
    } finally {
      setIsJoining(false)
    }
  }

  // Navigate to room detail
  const navigateToRoom = (roomId) => {
    router.push(`/split-rooms/${roomId}`)
  }

  // Filter rooms
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 md:p-6 lg:p-8 pt-20 lg:pt-24`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-2`}>
                  Split Rooms
                </h1>
                <p className={`${currentTheme.textSecondary}`}>
                  Manage shared expenses with friends and family
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <motion.button
                  onClick={() => {
                    clearJoinErrors()
                    resetJoin()
                    setIsJoinModalOpen(true)
                  }}
                  className={`flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-4 h-4" />
                  Join Room
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    clearRoomErrors()
                    resetRoom()
                    setIsCreateModalOpen(true)
                  }}
                  className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Create Room
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Total Rooms</p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>{rooms.length}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-lg flex items-center justify-center`}>
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Total Expenses</p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>
                    {rooms.reduce((sum, room) => sum + (room.expenses?.length || 0), 0)}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center`}>
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-4 mb-6`}
          >
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
              />
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

          {/* Rooms List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-8`}>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className={`ml-3 ${currentTheme.text}`}>Loading rooms...</span>
                </div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-8 text-center`}>
                <Home className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                  {searchTerm ? 'No rooms found' : 'No split rooms yet'}
                </h3>
                <p className={`${currentTheme.textSecondary} mb-4`}>
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first split room or join an existing one'
                  }
                </p>
                {!searchTerm && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        clearRoomErrors()
                        resetRoom()
                        setIsCreateModalOpen(true)
                      }}
                      className={`bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                    >
                      Create Room
                    </button>
                    <button
                      onClick={() => {
                        clearJoinErrors()
                        resetJoin()
                        setIsJoinModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Join Room
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredRooms.map((room, index) => (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 ${currentTheme.hover} transition-all duration-300 group cursor-pointer`}
                      onClick={() => navigateToRoom(room._id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${currentTheme.accent} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {room.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className={`font-semibold ${currentTheme.text} group-hover:text-blue-500 transition-colors`}>
                              {room.name}
                            </h3>
                            <p className={`text-sm ${currentTheme.textSecondary}`}>
                              Created {formatDate(room.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigateToRoom(room._id)
                            }}
                            className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${currentTheme.textSecondary}`}>Members</span>
                          <span className={`text-sm font-medium ${currentTheme.text}`}>
                            {room.users?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${currentTheme.textSecondary}`}>Expenses</span>
                          <span className={`text-sm font-medium ${currentTheme.text}`}>
                            {room.expenses?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${currentTheme.textSecondary}`}>Status</span>
                          <span className="text-sm font-medium text-green-500">Active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Create Room Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Create Split Room</h2>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitRoom(onCreateSubmit)} className="space-y-4">
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
                      onClick={() => setIsCreateModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isCreating ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Room'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join Room Modal */}
        <AnimatePresence>
          {isJoinModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsJoinModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Join Split Room</h2>
                  <button
                    onClick={() => setIsJoinModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitJoin(onJoinSubmit)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Room ID
                    </label>
                    <input
                      {...registerJoin('roomId')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter room ID"
                    />
                    {joinErrors.roomId && (
                      <p className="text-red-500 text-sm mt-1">{joinErrors.roomId.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsJoinModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300"
                    >
                      {isJoining ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Joining...
                        </div>
                      ) : (
                        'Join Room'
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