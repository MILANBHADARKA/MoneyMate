'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  ArrowRight
} from 'lucide-react'

function Footer() {
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  const themeClasses = {
    dark: {
      bg: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      text: 'text-slate-300',
      textPrimary: 'text-white',
      border: 'border-slate-700',
      accent: 'from-blue-400 to-purple-400',
      hover: 'hover:text-white'
    },
    light: {
      bg: 'bg-gray-50',
      bgSecondary: 'bg-white',
      text: 'text-gray-600',
      textPrimary: 'text-gray-900',
      border: 'border-gray-200',
      accent: 'from-blue-600 to-purple-600',
      hover: 'hover:text-gray-900'
    }
  }

  const currentTheme = themeClasses[theme]

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Security', href: '/security' },
        { name: 'Integrations', href: '/integrations' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Status', href: '/status' },
        { name: 'Community', href: '/community' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookies', href: '/cookies' },
        { name: 'Licenses', href: '/licenses' }
      ]
    }
  ]

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Github
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <footer className={`relative ${currentTheme.bg} ${currentTheme.text} overflow-hidden`}>
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-96 h-96 bg-gradient-to-br ${isDarkTheme ? 'from-blue-500/10' : 'from-blue-400/20'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl ${isDarkTheme ? 'from-purple-500/10' : 'from-purple-400/20'} rounded-full blur-3xl`}></div>
      </div>

      {/* Main Footer Content */}
      <motion.div 
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Company Info */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-br ${currentTheme.accent} rounded-xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src="/Logo.jpeg" alt="Logo" className='rounded-xl'/>
                </motion.div>
                <span className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
                  MoneyMate
                </span>
              </div>
              
              <p className={`${currentTheme.text} mb-6 leading-relaxed`}>
                MoneyMate helps you manage personal transactions with complete transparency and ease. 
                Take control of your finances and stay organized with our intuitive platform.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className={currentTheme.text}>work.bhadarka@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className={currentTheme.text}>+91 79848 58394</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className={currentTheme.text}>Nadiad, Gujarat</span>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div 
                key={section.title}
                className="lg:col-span-1"
                variants={itemVariants}
              >
                <h4 className={`text-lg font-semibold ${currentTheme.textPrimary} mb-4`}>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className={`${currentTheme.text} ${currentTheme.hover} transition-colors duration-300 hover:translate-x-1 inline-block`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div 
        className={`relative z-10 border-t ${currentTheme.border} py-8`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className={`text-sm ${currentTheme.text} flex items-center`}>
              © 2024 MoneyMate. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg ${currentTheme.text} ${currentTheme.hover} transition-all duration-300 hover:scale-110`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`flex items-center space-x-2 ${currentTheme.text} ${currentTheme.hover} transition-colors duration-300`}
              whileHover={{ y: -2 }}
            >
              <span className="text-sm">Back to top</span>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer