'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
    Menu,
    X,
    Wallet,
    Users,
    PieChart,
    LogOut,
    Search,
    User,
    Settings,
    Moon,
    Sun,
    ChevronDown,
    Sparkles,
    CreditCard,
    BarChart3,
    Bell
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredNav, setHoveredNav] = useState(null)

    const router = useRouter()
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useUser()
    const isDarkTheme = theme === 'dark'

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = async () => {
        try {
            if (!window.confirm("Are you sure you want to logout?")) {
                return;
            }

            const result = await logout()
            if (result.success) {
                router.push('/')
            }
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Navigation items with enhanced design
    const navItems = [
        {
            name: 'Customers',
            href: '/customers',
            icon: Wallet,
            active: pathname.includes('/customers'),
            gradient: 'from-emerald-400 to-teal-500',
            description: 'Manage customers'
        },
        {
            name: 'Split Rooms',
            href: '/split-rooms',
            icon: Users,
            active: pathname.includes('/split-rooms'),
            gradient: 'from-blue-400 to-purple-500',
            description: 'Shared expenses'
        }
    ]

    const themeClasses = {
        dark: {
            bg: scrolled ? 'bg-slate-900/80 border-slate-700/40' : 'bg-slate-900/60 border-slate-700/20',
            text: 'text-white',
            textSecondary: 'text-slate-400',
            hover: 'hover:bg-slate-800/60',
            cardBg: 'bg-slate-800/90 border-slate-700/40',
            accent: 'from-blue-400 to-purple-400',
            glow: 'shadow-blue-500/20'
        },
        light: {
            bg: scrolled ? 'bg-white/95 border-gray-200/60' : 'bg-white/80 border-gray-200/40',
            text: 'text-gray-900',
            textSecondary: 'text-gray-600',
            hover: 'hover:bg-gray-50/80',
            cardBg: 'bg-white/95 border-gray-200/50',
            accent: 'from-blue-600 to-purple-600',
            glow: 'shadow-blue-600/15'
        }
    }

    const currentTheme = themeClasses[theme]

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${currentTheme.bg}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Enhanced Logo */}
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => router.push('/dashboard')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            className={`relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${currentTheme.accent} rounded-2xl flex items-center justify-center shadow-lg ${currentTheme.glow} group-hover:shadow-xl transition-all duration-300`}
                            whileHover={{ 
                                rotate: [0, -10, 10, -5, 5, 0],
                                scale: 1.1 
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <img 
                                src="/Logo.jpeg" 
                                alt="Logo" 
                                className='w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover z-10 relative'
                            />
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Sparkles className="w-2 h-2 text-white" />
                            </motion.div>
                        </motion.div>

                        <div className="hidden sm:block">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300`}>
                                    MoneyMate
                                </span>
                                <div className={`text-xs ${currentTheme.textSecondary} font-medium group-hover:text-blue-500 transition-colors duration-300`}>
                                    Financial Intelligence
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                onMouseEnter={() => setHoveredNav(item.name)}
                                onMouseLeave={() => setHoveredNav(null)}
                                className="relative"
                            >
                                <Link
                                    href={item.href}
                                    className={`group relative flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                                        item.active
                                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${currentTheme.glow}`
                                            : `${currentTheme.text} ${currentTheme.hover} hover:scale-105`
                                    }`}
                                >
                                    <motion.div
                                        className={`p-1 rounded-lg mr-3 ${
                                            item.active 
                                                ? 'bg-white/20' 
                                                : `bg-transparent group-hover:bg-gradient-to-r group-hover:${item.gradient} group-hover:text-white`
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <item.icon size={18} />
                                    </motion.div>
                                    {item.name}
                                    
                                    {/* Animated indicator */}
                                    {item.active && (
                                        <motion.div
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
                                            layoutId="activeIndicator"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>

                                {/* Hover tooltip */}
                                <AnimatePresence>
                                    {hoveredNav === item.name && !item.active && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 ${currentTheme.cardBg} backdrop-blur-xl border rounded-lg shadow-xl z-50`}
                                        >
                                            <p className={`text-xs ${currentTheme.text} whitespace-nowrap`}>
                                                {item.description}
                                            </p>
                                            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br ${item.gradient} rounded-sm rotate-45`} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Enhanced Right Section */}
                    <div className="flex items-center space-x-3">
                        
                        {/* Enhanced Search Button */}
                        {/* <motion.button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-xl ${currentTheme.hover} transition-all duration-300 group`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Search className={`w-5 h-5 ${currentTheme.textSecondary} group-hover:text-blue-500 transition-colors`} />
                        </motion.button> */}

                        {/* Enhanced Notifications */}
                        {/* <motion.button
                            className={`relative hidden md:flex items-center justify-center w-10 h-10 rounded-xl ${currentTheme.hover} transition-all duration-300 group`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Bell className={`w-5 h-5 ${currentTheme.textSecondary} group-hover:text-blue-500 transition-colors`} />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button> */}

                        {/* Enhanced Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className={`relative w-10 h-10 rounded-xl ${currentTheme.hover} transition-all duration-300 overflow-hidden group`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="relative z-10 flex items-center justify-center w-full h-full"
                                animate={{ rotate: isDarkTheme ? 0 : 180 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {isDarkTheme ? (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-slate-600" />
                                )}
                            </motion.div>
                        </motion.button>

                        {/* Enhanced Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className={`flex items-center space-x-3 p-2 rounded-xl ${currentTheme.hover} transition-all duration-300 group`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`relative w-8 h-8 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center shadow-lg ${currentTheme.glow} group-hover:shadow-xl transition-all duration-300`}>
                                    <span className="text-white font-bold text-sm">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                
                                <div className="hidden lg:block text-left">
                                    <div className={`text-sm font-semibold ${currentTheme.text} group-hover:text-blue-500 transition-colors`}>
                                        {user?.username || 'User'}
                                    </div>
                                    <div className={`text-xs ${currentTheme.textSecondary} truncate max-w-32`}>
                                        {user?.email || 'user@example.com'}
                                    </div>
                                </div>
                                
                                <motion.div
                                    animate={{ rotate: profileOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className={`w-4 h-4 ${currentTheme.textSecondary} group-hover:text-blue-500 transition-colors`} />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className={`absolute right-0 mt-3 w-72 ${currentTheme.cardBg} backdrop-blur-xl border rounded-2xl shadow-2xl ${currentTheme.glow} z-50 overflow-hidden`}
                                    >
                                        {/* Profile Header */}
                                        <div className={`p-5 ${isDarkTheme ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/30' : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-gray-200/50'} border-b`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                                                    <span className="text-white font-bold text-lg">
                                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-semibold ${currentTheme.text} text-base`}>
                                                        {user?.username || 'User'}
                                                    </div>
                                                    <div className={`text-sm ${currentTheme.textSecondary} truncate`}>
                                                        {user?.email || 'user@example.com'}
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                                        <span className="text-xs text-green-500 font-medium">Online</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profile Menu */}
                                        <div className="p-2">
                                            <Link
                                                href="/profile"
                                                className={`flex items-center space-x-3 px-3 py-3 rounded-xl ${currentTheme.hover} transition-all duration-300 group`}
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <div className={`w-8 h-8 ${isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg flex items-center justify-center group-hover:${isDarkTheme ? 'bg-blue-500/30' : 'bg-blue-200'} transition-colors`}>
                                                    <User className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${currentTheme.text}`}>Profile</div>
                                                    <div className={`text-xs ${currentTheme.textSecondary}`}>Manage your account</div>
                                                </div>
                                            </Link>
                                            
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false)
                                                    handleLogout()
                                                }}
                                                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-red-500 ${isDarkTheme ? 'hover:bg-red-500/10' : 'hover:bg-red-50'} transition-all duration-300 w-full text-left group`}
                                            >
                                                <div className={`w-8 h-8 ${isDarkTheme ? 'bg-red-500/20' : 'bg-red-100'} rounded-lg flex items-center justify-center group-hover:${isDarkTheme ? 'bg-red-500/30' : 'bg-red-200'} transition-colors`}>
                                                    <LogOut className="w-4 h-4 text-red-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Sign Out</div>
                                                    <div className={`text-xs ${isDarkTheme ? 'text-red-400' : 'text-red-500'}`}>End your session</div>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Mobile Menu Button */}
                        <motion.button
                            className="lg:hidden p-2 rounded-xl transition-all duration-300"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <motion.div
                                animate={{ rotate: menuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {menuOpen ? (
                                    <X size={24} className={currentTheme.text} />
                                ) : (
                                    <Menu size={24} className={currentTheme.text} />
                                )}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`lg:hidden ${currentTheme.cardBg} backdrop-blur-xl border-t ${isDarkTheme ? 'border-slate-700/40' : 'border-gray-200/40'}`}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                                            item.active
                                                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                                : `${currentTheme.text} ${currentTheme.hover}`
                                        }`}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg mr-4 ${
                                            item.active ? 'bg-white/20' : `${isDarkTheme ? 'bg-slate-700/50' : 'bg-gray-100'}`
                                        }`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{item.name}</div>
                                            <div className={`text-xs ${item.active ? 'text-white/80' : currentTheme.textSecondary}`}>
                                                {item.description}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}

export default Header