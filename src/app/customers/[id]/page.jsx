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
  Edit3, 
  Trash2, 
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  Receipt,
  Eye,
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal,
  X
} from 'lucide-react'

const entrySchema = z.object({
  amount: z.number()
    .min(0.01, "Amount must be greater than 0")
    .max(9999999, "Amount is too large"),
  reason: z.string()
    .max(200, "Reason must be less than 200 characters")
    .optional(),
  entryType: z.enum(['You Gave', 'You Get'], {
    required_error: "Entry type is required",
  })
})

const customerSchema = z.object({
  name: z.string()
    .min(1, "Customer name is required")
    .max(50, "Customer name must be less than 50 characters")
    .trim()
})

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState(null)
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // all, You Gave, You Get
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false)
  const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false)
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false)
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false)
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isCreatingEntry, setIsCreatingEntry] = useState(false)
  const [isUpdatingEntry, setIsUpdatingEntry] = useState(false)
  const [isDeletingEntry, setIsDeletingEntry] = useState(false)
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false)
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false)
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalGave: 0,
    totalGet: 0,
    balance: 0
  })

  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { theme } = useTheme()

  const {
    register: registerEntry,
    handleSubmit: handleSubmitEntry,
    formState: { errors: entryErrors },
    reset: resetEntry,
    setValue: setEntryValue,
    setError: setEntryError,
    clearErrors: clearEntryErrors
  } = useForm({
    resolver: zodResolver(entrySchema)
  })

  const {
    register: registerCustomer,
    handleSubmit: handleSubmitCustomer,
    formState: { errors: customerErrors },
    reset: resetCustomer,
    setValue: setCustomerValue,
    setError: setCustomerError,
    clearErrors: clearCustomerErrors
  } = useForm({
    resolver: zodResolver(customerSchema)
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

  // Fetch customer details
  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customer/${id}`)
      const result = await response.json()

      if (result.success) {
        setCustomer(result.customer)
      } else {
        setError(result.error || 'Failed to fetch customer')
      }
    } catch (error) {
      console.error('Fetch customer error:', error)
      setError('An error occurred while fetching customer details')
    }
  }

  // Fetch entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(`/api/entry?customerId=${id}`)
      const result = await response.json()

      if (result.success) {
        setEntries(result.entries)
        calculateStats(result.entries)
      } else {
        if (response.status === 404) {
          setEntries([])
          calculateStats([])
        } else {
          setError(result.error || 'Failed to fetch entries')
        }
      }
    } catch (error) {
      console.error('Fetch entries error:', error)
      setError('An error occurred while fetching entries')
    }
  }

  // Calculate statistics
  const calculateStats = (entriesData) => {
    const totalGave = entriesData
      .filter(entry => entry.entryType === 'You Gave')
      .reduce((sum, entry) => sum + entry.amount, 0)
    
    const totalGet = entriesData
      .filter(entry => entry.entryType === 'You Get')
      .reduce((sum, entry) => sum + entry.amount, 0)
    
    setStats({
      totalEntries: entriesData.length,
      totalGave,
      totalGet,
      balance: totalGet - totalGave // Positive means customer owes you, negative means you owe customer
    })
  }

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setIsLoading(true)
        await Promise.all([fetchCustomer(), fetchEntries()])
        setIsLoading(false)
      }
      loadData()
    }
  }, [id])

  // Create entry
  const onCreateEntry = async (data) => {
    setIsCreatingEntry(true)
    clearEntryErrors()
    try {
      const response = await fetch(`/api/entry?customerId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        const newEntries = [...entries, result.entry]
        setEntries(newEntries)
        calculateStats(newEntries)
        setIsAddEntryModalOpen(false)
        resetEntry()
        setError('')
      } else {
        setEntryError('amount', {
          type: 'manual',
          message: result.error || 'Failed to create entry'
        })
      }
    } catch (error) {
      console.error('Create entry error:', error)
      setEntryError('amount', {
        type: 'manual',
        message: 'An error occurred while creating entry'
      })
    } finally {
      setIsCreatingEntry(false)
    }
  }

  // Update entry
  const onUpdateEntry = async (data) => {
    if (!selectedEntry) return
    
    setIsUpdatingEntry(true)
    clearEntryErrors()
    try {
      const response = await fetch(`/api/entry/${selectedEntry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        const updatedEntries = entries.map(entry => 
          entry._id === selectedEntry._id 
            ? { ...entry, ...data }
            : entry
        )
        setEntries(updatedEntries)
        calculateStats(updatedEntries)
        setIsEditEntryModalOpen(false)
        setSelectedEntry(null)
        resetEntry()
        setError('')
      } else {
        setEntryError('amount', {
          type: 'manual',
          message: result.error || 'Failed to update entry'
        })
      }
    } catch (error) {
      console.error('Update entry error:', error)
      setEntryError('amount', {
        type: 'manual',
        message: 'An error occurred while updating entry'
      })
    } finally {
      setIsUpdatingEntry(false)
    }
  }

  // Delete entry
  const handleDeleteEntry = async () => {
    if (!selectedEntry) return
    
    setIsDeletingEntry(true)
    try {
      const response = await fetch(`/api/entry/${selectedEntry._id}?customerId=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        const updatedEntries = entries.filter(entry => entry._id !== selectedEntry._id)
        setEntries(updatedEntries)
        calculateStats(updatedEntries)
        setIsDeleteEntryModalOpen(false)
        setSelectedEntry(null)
        setError('')
      } else {
        setError(result.error || 'Failed to delete entry')
      }
    } catch (error) {
      console.error('Delete entry error:', error)
      setError('An error occurred while deleting entry')
    } finally {
      setIsDeletingEntry(false)
    }
  }

  // Update customer
  const onUpdateCustomer = async (data) => {
    setIsUpdatingCustomer(true)
    clearCustomerErrors()
    try {
      const response = await fetch(`/api/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setCustomer(result.customer)
        setIsEditCustomerModalOpen(false)
        resetCustomer()
        setError('')
      } else {
        setCustomerError('name', {
          type: 'manual',
          message: result.error || 'Failed to update customer'
        })
      }
    } catch (error) {
      console.error('Update customer error:', error)
      setCustomerError('name', {
        type: 'manual',
        message: 'An error occurred while updating customer'
      })
    } finally {
      setIsUpdatingCustomer(false)
    }
  }

  // Delete customer
  const handleDeleteCustomer = async () => {
    setIsDeletingCustomer(true)
    try {
      const response = await fetch(`/api/customer/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        router.push('/customers')
      } else {
        setError(result.error || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('Delete customer error:', error)
      setError('An error occurred while deleting customer')
    } finally {
      setIsDeletingCustomer(false)
    }
  }

  // Open modals
  const openEditEntryModal = (entry) => {
    setSelectedEntry(entry)
    setEntryValue('amount', entry.amount)
    setEntryValue('reason', entry.reason || '')
    setEntryValue('entryType', entry.entryType)
    clearEntryErrors()
    setIsEditEntryModalOpen(true)
  }

  const openDeleteEntryModal = (entry) => {
    setSelectedEntry(entry)
    setIsDeleteEntryModalOpen(true)
  }

  const openEditCustomerModal = () => {
    if (customer) {
      setCustomerValue('name', customer.name)
      clearCustomerErrors()
      setIsEditCustomerModalOpen(true)
    }
  }

  // Filter entries based on search and type
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.reason?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const matchesType = filterType === 'all' || entry.entryType === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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
                <span className={`ml-3 ${currentTheme.text}`}>Loading customer details...</span>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && !customer) {
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
              onClick={() => router.push('/customers')}
              className={`flex items-center gap-2 ${currentTheme.text} ${currentTheme.hover} px-4 py-2 rounded-lg transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
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
                onClick={() => router.push('/customers')}
                className={`flex items-center gap-2 ${currentTheme.text} ${currentTheme.hover} px-3 py-2 rounded-lg transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {customer?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
                    {customer?.name}
                  </h1>
                  <p className={`${currentTheme.textSecondary}`}>
                    Customer since {formatDate(customer?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={openEditCustomerModal}
                  className={`flex items-center gap-2 ${currentTheme.hover} px-3 py-2 rounded-lg transition-colors`}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Customer
                </button>
                <button
                  onClick={() => setIsDeleteCustomerModalOpen(true)}
                  className={`flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
              
              <button
                onClick={() => {
                  clearEntryErrors()
                  resetEntry()
                  setIsAddEntryModalOpen(true)
                }}
                className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Total Entries</p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>{stats.totalEntries}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>You Gave</p>
                  <p className={`text-2xl font-bold text-red-500`}>{formatCurrency(stats.totalGave)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>You Get</p>
                  <p className={`text-2xl font-bold text-green-500`}>{formatCurrency(stats.totalGet)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Net Balance</p>
                  <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.balance >= 0 ? '+' : ''}{formatCurrency(stats.balance)}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stats.balance >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-lg flex items-center justify-center`}>
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-4 mb-6`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search entries by reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
              >
                <option value="all">All Entries</option>
                <option value="You Gave">You Gave</option>
                <option value="You Get">You Get</option>
              </select>
            </div>
          </motion.div>

          {/* Entries List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl overflow-hidden`}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600">
              <h2 className={`text-lg font-semibold ${currentTheme.text}`}>Transaction History</h2>
            </div>
            
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center">
                <Receipt className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                  {searchTerm || filterType !== 'all' ? 'No entries found' : 'No entries yet'}
                </h3>
                <p className={`${currentTheme.textSecondary} mb-4`}>
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding the first transaction entry'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <button
                    onClick={() => {
                      clearEntryErrors()
                      resetEntry()
                      setIsAddEntryModalOpen(true)
                    }}
                    className={`bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    Add First Entry
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-600">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 ${currentTheme.hover} transition-colors group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          entry.entryType === 'You Get' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {entry.entryType === 'You Get' ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className={`font-medium ${currentTheme.text}`}>
                            {entry.reason || 'No reason provided'}
                          </h3>
                          <p className={`text-sm ${currentTheme.textSecondary}`}>
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-semibold ${
                            entry.entryType === 'You Get' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {entry.entryType === 'You Get' ? '+' : '-'}{formatCurrency(entry.amount)}
                          </p>
                          <p className={`text-sm ${currentTheme.textSecondary}`}>
                            {entry.entryType}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditEntryModal(entry)}
                            className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                          >
                            <Edit3 className="w-4 h-4 text-green-500" />
                          </button>
                          <button
                            onClick={() => openDeleteEntryModal(entry)}
                            className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Add Entry Modal */}
        <AnimatePresence>
          {isAddEntryModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsAddEntryModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Add Entry</h2>
                  <button
                    onClick={() => setIsAddEntryModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitEntry(onCreateEntry)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Entry Type
                    </label>
                    <select
                      {...registerEntry('entryType')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                    >
                      <option value="">Select entry type</option>
                      <option value="You Gave">You Gave</option>
                      <option value="You Get">You Get</option>
                    </select>
                    {entryErrors.entryType && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.entryType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Amount
                    </label>
                    <input
                      {...registerEntry('amount', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter amount"
                    />
                    {entryErrors.amount && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Reason (Optional)
                    </label>
                    <textarea
                      {...registerEntry('reason')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter reason"
                      rows={3}
                    />
                    {entryErrors.reason && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.reason.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddEntryModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingEntry}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isCreatingEntry ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Entry'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Entry Modal */}
        <AnimatePresence>
          {isEditEntryModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditEntryModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Edit Entry</h2>
                  <button
                    onClick={() => setIsEditEntryModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitEntry(onUpdateEntry)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Entry Type
                    </label>
                    <select
                      {...registerEntry('entryType')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                    >
                      <option value="">Select entry type</option>
                      <option value="You Gave">You Gave</option>
                      <option value="You Get">You Get</option>
                    </select>
                    {entryErrors.entryType && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.entryType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Amount
                    </label>
                    <input
                      {...registerEntry('amount', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter amount"
                    />
                    {entryErrors.amount && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Reason (Optional)
                    </label>
                    <textarea
                      {...registerEntry('reason')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter reason"
                      rows={3}
                    />
                    {entryErrors.reason && (
                      <p className="text-red-500 text-sm mt-1">{entryErrors.reason.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditEntryModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingEntry}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isUpdatingEntry ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Entry'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Entry Modal */}
        <AnimatePresence>
          {isDeleteEntryModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsDeleteEntryModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Delete Entry</h2>
                  <button
                    onClick={() => setIsDeleteEntryModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <p className={`text-center ${currentTheme.text} mb-2`}>
                    Are you sure you want to delete this entry?
                  </p>
                  <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteEntryModalOpen(false)}
                    className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteEntry}
                    disabled={isDeletingEntry}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {isDeletingEntry ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Entry'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Customer Modal */}
        <AnimatePresence>
          {isEditCustomerModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditCustomerModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Edit Customer</h2>
                  <button
                    onClick={() => setIsEditCustomerModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitCustomer(onUpdateCustomer)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Customer Name
                    </label>
                    <input
                      {...registerCustomer('name')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter customer name"
                    />
                    {customerErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{customerErrors.name.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditCustomerModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingCustomer}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isUpdatingCustomer ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Customer'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Customer Modal */}
        <AnimatePresence>
          {isDeleteCustomerModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsDeleteCustomerModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 w-full max-w-md`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Delete Customer</h2>
                  <button
                    onClick={() => setIsDeleteCustomerModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <p className={`text-center ${currentTheme.text} mb-2`}>
                    Are you sure you want to delete{' '}
                    <span className="font-semibold">{customer?.name}</span>?
                  </p>
                  <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
                    This action cannot be undone. All entries for this customer will also be deleted.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteCustomerModalOpen(false)}
                    className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCustomer}
                    disabled={isDeletingCustomer}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {isDeletingCustomer ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      'Delete Customer'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  )
}