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
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

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

    // Navigation items
    const navItems = [
        // {
        //     name: 'Dashboard',
        //     href: '/dashboard',
        //     icon: PieChart,
        //     active: pathname === '/dashboard'
        // },
        {
            name: 'Customers',
            href: '/customers',
            icon: Wallet,
            active: pathname.includes('/customers')
        },
        {
            name: 'Split Rooms',
            href: '/split-rooms',
            icon: Users,
            active: pathname.includes('/split-rooms')
        }
    ]

    const themeClasses = {
        dark: {
            bg: scrolled ? 'bg-slate-900/95' : 'bg-slate-900/80',
            text: 'text-white',
            border: 'border-slate-700',
            hover: 'hover:bg-slate-700',
            accent: 'from-blue-400 to-purple-400'
        },
        light: {
            bg: scrolled ? 'bg-white/95' : 'bg-white/80',
            text: 'text-gray-900',
            border: 'border-gray-200',
            hover: 'hover:bg-gray-100',
            accent: 'from-blue-600 to-purple-600'
        }
    }

    const currentTheme = themeClasses[theme]

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.bg} backdrop-blur-md border-b ${currentTheme.border} transition-all duration-300`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => router.push('/dashboard')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center shadow-lg`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* <svg
                                className="w-6 h-6 lg:w-7 lg:h-7 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M4 20V4l8 9 8-9v16" />
                            </svg> */}
                            <img src="/Logo.jpeg" alt="Logo" className='rounded-xl'/>
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
                                MoneyMate
                            </span>
                            <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} font-medium`}>
                                Financial Tracker
                            </div>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`group relative flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${item.active
                                            ? `${isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`
                                            : `${currentTheme.text} ${currentTheme.hover}`
                                        }`}
                                >
                                    <item.icon
                                        size={18}
                                        className={`mr-2 ${item.active ? (isDarkTheme ? 'text-blue-400' : 'text-blue-600') : (isDarkTheme ? 'text-slate-400' : 'text-gray-500')}`}
                                    />
                                    {item.name}
                                    {item.active && (
                                        <motion.div
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentTheme.accent} rounded-full`}
                                            layoutId="activeTab"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2 lg:space-x-4">

                        {/* Search */}
                        <motion.div className="relative hidden md:block">
                            <AnimatePresence>
                                {searchOpen ? (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 280, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            className={`w-full px-4 py-2 pl-10 pr-4 ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            autoFocus
                                            onBlur={() => setSearchOpen(false)}
                                        />
                                        <Search size={18} className={`absolute left-3 ${isDarkTheme ? 'text-slate-400' : 'text-gray-400'}`} />
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        onClick={() => setSearchOpen(true)}
                                        className={`p-2 rounded-lg ${currentTheme.hover} transition-colors`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Search size={20} className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg ${currentTheme.hover} transition-colors`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: isDarkTheme ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isDarkTheme ? (
                                    <Sun size={20} className="text-yellow-400" />
                                ) : (
                                    <Moon size={20} className="text-slate-600" />
                                )}
                            </motion.div>
                        </motion.button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className={`flex items-center space-x-2 p-2 rounded-lg ${currentTheme.hover} transition-colors`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`w-8 h-8 bg-gradient-to-br ${currentTheme.accent} rounded-full flex items-center justify-center`}>
                                    <span className="text-white font-semibold text-sm">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="hidden lg:block text-left">
                                    <div className={`text-sm font-medium ${currentTheme.text}`}>
                                        {user?.username || 'User'}
                                    </div>
                                    <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {user?.email || 'user@example.com'}
                                    </div>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`${isDarkTheme ? 'text-slate-400' : 'text-gray-500'} transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                                />
                            </motion.button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute right-0 mt-2 w-64 ${isDarkTheme ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl backdrop-blur-md z-50`}
                                    >
                                        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-full flex items-center justify-center`}>
                                                    <span className="text-white font-bold">
                                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${currentTheme.text}`}>{user?.username || 'User'}</div>
                                                    <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                                                        {user?.email || 'user@example.com'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href="/profile"
                                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${currentTheme.hover} transition-colors`}
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <User size={18} className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'} />
                                                <span className={currentTheme.text}>Profile</span>
                                            </Link>
                                            {/* <Link
                                                href="/settings"
                                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${currentTheme.hover} transition-colors`}
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <Settings size={18} className={isDarkTheme ? 'text-slate-400' : 'text-gray-500'} />
                                                <span className={currentTheme.text}>Settings</span>
                                            </Link> */}
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false)
                                                    handleLogout()
                                                }}
                                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                                            >
                                                <LogOut size={18} />
                                                <span>Sign Out</span>   
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="lg:hidden p-2"
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`lg:hidden ${currentTheme.bg} border-t ${currentTheme.border} backdrop-blur-md`}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${item.active
                                                ? `${isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`
                                                : `${currentTheme.text} ${currentTheme.hover}`
                                            }`}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <item.icon size={20} className="mr-3" />
                                        {item.name}
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