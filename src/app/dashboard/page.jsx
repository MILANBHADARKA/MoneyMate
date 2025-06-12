'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'
import Header from '@/components/header/Header'
import Loader from '@/components/loader/Loader'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Activity
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBalance: 25430,
    totalIncome: 85000,
    totalExpenses: 59570,
    totalCustomers: 24
  })
  const router = useRouter()
  const { theme } = useTheme()
  const { user, isLoading, isAuthenticated } = useUser()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <Loader text="Loading your dashboard..." />
  }

  if (!isAuthenticated) {
    return null // Will redirect to sign-in
  }

  const themeClasses = {
    dark: {
      bg: "bg-slate-900",
      cardBg: "bg-slate-800",
      text: "text-white",
      textMuted: "text-slate-400",
      border: "border-slate-700",
      accent: "from-blue-400 to-purple-400",
      hover: "hover:bg-slate-700"
    },
    light: {
      bg: "bg-gray-50",
      cardBg: "bg-white",
      text: "text-gray-900",
      textMuted: "text-gray-600",
      border: "border-gray-200",
      accent: "from-blue-600 to-purple-600",
      hover: "hover:bg-gray-50"
    }
  }

  const currentTheme = themeClasses[theme]

  const dashboardCards = [
    {
      title: "Total Balance",
      value: `$${stats.totalBalance.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Total Income",
      value: `$${stats.totalIncome.toLocaleString()}`,
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Total Expenses",
      value: `$${stats.totalExpenses.toLocaleString()}`,
      change: "-3.1%",
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      change: "+15.3%",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
  ]

  const quickActions = [
    {
      title: "Add Customer",
      description: "Create a new customer account",
      icon: Users,
      color: "bg-blue-500",
      href: "/customers/new"
    },
    {
      title: "Record Transaction",
      description: "Add income or expense",
      icon: CreditCard,
      color: "bg-green-500",
      href: "/transactions/new"
    },
    {
      title: "View Analytics",
      description: "Check your financial insights",
      icon: PieChart,
      color: "bg-purple-500",
      href: "/analytics"
    }
  ]

  const recentTransactions = [
    {
      id: 1,
      customer: "John Doe",
      amount: 150,
      type: "income",
      description: "Payment received",
      date: "2024-01-15"
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: 75,
      type: "expense",
      description: "Refund issued",
      date: "2024-01-14"
    },
    {
      id: 3,
      customer: "Mike Johnson",
      amount: 300,
      type: "income",
      description: "Service payment",
      date: "2024-01-14"
    }
  ]

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}>
        {/* <Header /> */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                  Welcome back, {user?.username || 'User'}! 👋
                </h1>
                <p className={`${currentTheme.textMuted}`}>
                  Here's an overview of your financial activity
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <motion.button
                  className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${currentTheme.accent} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Quick Add</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {dashboardCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <span className={`text-sm font-medium flex items-center ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {card.change.startsWith('+') ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {card.change}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold ${currentTheme.text} mb-1`}>
                  {card.value}
                </h3>
                <p className={`text-sm ${currentTheme.textMuted}`}>
                  {card.title}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Quick Actions
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-4 shadow-sm ${currentTheme.hover} transition-all duration-300 cursor-pointer`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => router.push(action.href)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text}`}>
                          {action.title}
                        </h3>
                        <p className={`text-sm ${currentTheme.textMuted}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${currentTheme.text}`}>
                  Recent Transactions
                </h2>
                <motion.button
                  className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                >
                  View All
                </motion.button>
              </div>
              <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl shadow-sm overflow-hidden`}>
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className={`p-4 ${currentTheme.hover} transition-colors cursor-pointer`}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${transaction.type === 'income'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className={`w-4 h-4 ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                }`} />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${currentTheme.text}`}>
                              {transaction.customer}
                            </p>
                            <p className={`text-sm ${currentTheme.textMuted}`}>
                              {transaction.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                          </p>
                          <p className={`text-sm ${currentTheme.textMuted} flex items-center`}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Financial Overview Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <h2 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
              Financial Overview
            </h2>
            <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-6 shadow-sm`}>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Activity className={`w-16 h-16 ${currentTheme.textMuted} mx-auto mb-4`} />
                  <p className={`${currentTheme.textMuted}`}>
                    Chart visualization will be implemented here
                  </p>
                  <p className={`text-sm ${currentTheme.textMuted} mt-2`}>
                    Coming soon: Interactive financial charts and analytics
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
