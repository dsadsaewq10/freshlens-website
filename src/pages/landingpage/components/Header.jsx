import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

// currentPage prop: 'home' | 'technology' | 'dataset'
function Header({ isLoaded = true, currentPage }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Derive active page from prop or route
  const activePage = currentPage || (
    location.pathname === '/technology' ? 'technology'
    : location.pathname === '/dataset' ? 'dataset'
    : 'home'
  )

  const isHome = activePage === 'home'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Anchor links only work on the landing page
  const anchorLinks = [
    { href: '#features', label: 'Features' },
    { href: '#benefits', label: 'Benefits' },
    { href: '#download', label: 'Download' },
  ]

  // Page navigation links with active state
  const pageLinks = [
    { path: '/technology', label: 'Technology', key: 'technology' },
    { path: '/dataset', label: 'Dataset', key: 'dataset' },
  ]

  const handleAnchorClick = (href) => {
    setIsMobileMenuOpen(false)
    if (!isHome) {
      // Navigate home first, then scroll to section
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const handlePageClick = (path) => {
    setIsMobileMenuOpen(false)
    navigate(path)
  }

  // Active indicator styles
  const getNavClass = (key) => {
    const isActive = activePage === key
    return `transition-colors font-medium relative ${
      isActive
        ? 'text-primary font-semibold'
        : 'text-accent hover:text-primary'
    }`
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-accent">
              FreshLens
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {anchorLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : undefined}
                onClick={!isHome ? () => handleAnchorClick(link.href) : undefined}
                className="text-accent hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handlePageClick(link.path)}
                className={getNavClass(link.key)}
              >
                {link.label}
                {activePage === link.key && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#285A53' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {isHome ? (
              <a
                href="#download"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Get the App
              </a>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
              >
                Get the App
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-accent transition-all ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-accent transition-all ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-accent transition-all ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-72 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
            {anchorLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : undefined}
                onClick={() => { if (!isHome) handleAnchorClick(link.href); else setIsMobileMenuOpen(false); }}
                className="text-accent hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handlePageClick(link.path)}
                className={`text-left ${getNavClass(link.key)}`}
              >
                {activePage === link.key && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: '#285A53' }} />
                )}
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setIsMobileMenuOpen(false); if (!isHome) navigate('/'); }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-center mt-2"
            >
              Get the App
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Header
