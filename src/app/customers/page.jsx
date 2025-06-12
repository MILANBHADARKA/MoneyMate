'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/context/ThemeContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  User,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  X,
  Check,
  AlertCircle,
  Eye
} from 'lucide-react'

const customerSchema = z.object({
  name: z.string()
    .min(1, "Customer name is required")
    .max(50, "Customer name must be less than 50 characters")
    .trim()
})

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const { theme } = useTheme()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError: setFormError,
    clearErrors
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

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch('/api/customer')
      const result = await response.json()

      if (result.success) {
        setCustomers(result.customers)
      } else {
        if (response.status === 404) {
          setCustomers([])
        } else {
          setError(result.error || 'Failed to fetch customers')
        }
      }
    } catch (error) {
      console.error('Fetch customers error:', error)
      setError('An error occurred while fetching customers')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Create customer
  const onCreateSubmit = async (data) => {
    setIsCreating(true)
    clearErrors()
    try {
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setCustomers(prev => [...prev, result.customer])
        setIsCreateModalOpen(false)
        reset()
        setError('')
      } else {
        setFormError('name', {
          type: 'manual',
          message: result.error || 'Failed to create customer'
        })
      }
    } catch (error) {
      console.error('Create customer error:', error)
      setFormError('name', {
        type: 'manual',
        message: 'An error occurred while creating customer'
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Update customer
  const onEditSubmit = async (data) => {
    if (!selectedCustomer) return
    
    setIsUpdating(true)
    clearErrors()
    try {
      const response = await fetch(`/api/customer/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setCustomers(prev => 
          prev.map(customer => 
            customer._id === selectedCustomer._id 
              ? { ...customer, name: data.name }
              : customer
          )
        )
        setIsEditModalOpen(false)
        setSelectedCustomer(null)
        reset()
        setError('')
      } else {
        setFormError('name', {
          type: 'manual',
          message: result.error || 'Failed to update customer'
        })
      }
    } catch (error) {
      console.error('Update customer error:', error)
      setFormError('name', {
        type: 'manual',
        message: 'An error occurred while updating customer'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete customer
  const handleDelete = async () => {
    if (!selectedCustomer) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/customer/${selectedCustomer._id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setCustomers(prev => prev.filter(customer => customer._id !== selectedCustomer._id))
        setIsDeleteModalOpen(false)
        setSelectedCustomer(null)
        setError('')
      } else {
        setError(result.error || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('Delete customer error:', error)
      setError('An error occurred while deleting customer')
    } finally {
      setIsDeleting(false)
    }
  }

  // Open edit modal
  const openEditModal = (customer) => {
    setSelectedCustomer(customer)
    setValue('name', customer.name)
    clearErrors()
    setIsEditModalOpen(true)
  }

  // Open delete modal
  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  // Navigate to customer detail
  const navigateToCustomer = (customerId) => {
    router.push(`/customers/${customerId}`)
  }

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === 'asc' ? comparison : -comparison
    })

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
                  Customers
                </h1>
                <p className={`${currentTheme.textSecondary}`}>
                  Manage your customer relationships and track their activities
                </p>
              </div>
              
              <motion.button
                onClick={() => {
                  clearErrors()
                  reset()
                  setIsCreateModalOpen(true)
                }}
                className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                Add Customer
              </motion.button>
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
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Total Customers</p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>{customers.length}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-lg flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>This Month</p>
                  <p className={`text-2xl font-bold ${currentTheme.text}`}>
                    {customers.filter(customer => {
                      const customerDate = new Date(customer.createdAt)
                      const currentDate = new Date()
                      return customerDate.getMonth() === currentDate.getMonth() && 
                             customerDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                />
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`flex items-center gap-2 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span className={`${currentTheme.text} text-sm`}>Name</span>
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

          {/* Customers List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-8`}>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className={`ml-3 ${currentTheme.text}`}>Loading customers...</span>
                </div>
              </div>
            ) : filteredAndSortedCustomers.length === 0 ? (
              <div className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-8 text-center`}>
                <Users className={`w-16 h-16 ${currentTheme.textSecondary} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>
                  {searchTerm ? 'No customers found' : 'No customers yet'}
                </h3>
                <p className={`${currentTheme.textSecondary} mb-4`}>
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Get started by adding your first customer'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      clearErrors()
                      reset()
                      setIsCreateModalOpen(true)
                    }}
                    className={`bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    Add Customer
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredAndSortedCustomers.map((customer, index) => (
                    <motion.div
                      key={customer._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.border} rounded-xl p-6 ${currentTheme.hover} transition-all duration-300 group cursor-pointer`}
                      onClick={() => navigateToCustomer(customer._id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${currentTheme.accent} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className={`font-semibold ${currentTheme.text} group-hover:text-blue-500 transition-colors`}>
                              {customer.name}
                            </h3>
                            <p className={`text-sm ${currentTheme.textSecondary}`}>
                              Added {formatDate(customer.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigateToCustomer(customer._id)
                              }}
                              className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                            >
                              <Eye className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditModal(customer)
                              }}
                              className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                            >
                              <Edit3 className="w-4 h-4 text-green-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteModal(customer)
                              }}
                              className={`p-1.5 ${currentTheme.hover} rounded-lg transition-colors`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${currentTheme.textSecondary}`}>Entries</span>
                          <span className={`text-sm font-medium ${currentTheme.text}`}>
                            {customer.entries?.length || 0}
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

        {/* Create Customer Modal */}
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
                  <h2 className={`text-xl font-bold ${currentTheme.text}`}>Add Customer</h2>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Customer Name
                    </label>
                    <input
                      {...register('name')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter customer name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                        'Create Customer'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Customer Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsEditModalOpen(false)}
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
                    onClick={() => setIsEditModalOpen(false)}
                    className={`p-1 ${currentTheme.hover} rounded-lg transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                      Customer Name
                    </label>
                    <input
                      {...register('name')}
                      className={`w-full px-3 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${currentTheme.inputText}`}
                      placeholder="Enter customer name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`flex-1 bg-gradient-to-r ${currentTheme.accent} text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300`}
                    >
                      {isUpdating ? (
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
          {isDeleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsDeleteModalOpen(false)}
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
                    onClick={() => setIsDeleteModalOpen(false)}
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
                    <span className="font-semibold">{selectedCustomer?.name}</span>?
                  </p>
                  <p className={`text-center text-sm ${currentTheme.textSecondary}`}>
                    This action cannot be undone. All entries for this customer will also be deleted.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.inputBorder} border rounded-lg ${currentTheme.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {isDeleting ? (
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