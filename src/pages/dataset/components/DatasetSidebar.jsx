import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

export default function DatasetSidebar({ isOpen, onClose, currentPage = 'list' }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Sidebar menu items
  const menuItems = [
    { id: 'all', label: 'All Datasets', icon: 'list', path: '/datasets' },
    { id: 'trending', label: 'Trending', icon: 'trending', path: '/datasets?filter=trending' },
    { id: 'recent', label: 'Recent', icon: 'clock', path: '/datasets?filter=recent' },
    { id: 'favorites', label: 'Favorites', icon: 'star', path: '/datasets?filter=favorites' },
  ]

  // Determine active menu item based on current path
  const isActive = (path) => {
    if (path.includes('?')) {
      const [pathPart, queryPart] = path.split('?')
      return location.pathname === pathPart && location.search === `?${queryPart}`
    }
    return location.pathname === path
  }

  // SVG Icons
  const iconMap = {
    list: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    trending: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    clock: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    star: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    ),
  }

  // Handle menu item click
  const handleMenuClick = (item) => {
    onClose()
    navigate(item.path)
  }

  // Sidebar content
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => {
            onClose()
            navigate('/')
          }}
          className="flex items-center gap-3 w-full hover:opacity-70 transition-opacity"
        >
          <img
            src="/assets/logo/freshlens_logo.png"
            alt="FreshLens"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-bold" style={{ color: COLORS.primary }}>
            FreshLens
          </span>
        </button>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 p-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4 px-3">
          Datasets
        </p>
        {menuItems.map((item) => {
          const active = isActive(item.path)
          return (
            <motion.button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                active
                  ? 'text-white font-semibold shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{
                background: active ? COLORS.primary : undefined,
              }}
            >
              {iconMap[item.icon]}
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-6 border-t border-gray-200 text-center">
        <p className="text-[11px] text-gray-500">v1.0.0</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto z-40">
        {sidebarContent}
      </div>

      {/* Mobile/Tablet Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 w-64 h-screen bg-white z-50 overflow-y-auto shadow-lg"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
