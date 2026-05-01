import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../auth/useAuth'

// currentPage prop: 'home' | 'technology' | 'dataset'
function Header({ isLoaded = true, currentPage }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, loading } = useAuth()

  // Derive active page from prop or route
  const activePage = currentPage || (
    location.pathname === '/technology' ? 'technology'
    : location.pathname.startsWith('/datasets') ? 'dataset'
    : 'home'
  )

  const isHome = activePage === 'home'
  const isOnDatasetPage = activePage === 'dataset'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items (Dataset tab only shown on home and technology pages)
  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Technology', key: 'technology', path: '/technology' },
    ...(isOnDatasetPage ? [] : [{ label: 'Dataset', key: 'dataset', path: '/datasets' }]),
  ]

  const handleNavClick = (item) => {
    setIsMobileMenuOpen(false)
    if (item.key === 'home') {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
    } else {
      navigate(item.path)
    }
  }

  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : 'User'

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.username ||
    user?.email?.split('@')[0] ||
    'there'

  const handleLogout = async ({ closeMobile } = {}) => {
    setLogoutError('')
    setIsLoggingOut(true)

    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (closeMobile) {
      setIsMobileMenuOpen(false)
    }

    if (error) {
      setLogoutError(error.message)
      setIsLoggingOut(false)
      return
    }

    setIsLoggingOut(false)
    navigate('/login', { replace: true })
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-200/60'
          : 'bg-transparent border-gray-200/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img
              src="/assets/logo/freshlens_logo.png"
              alt="FreshLens"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl lg:text-2xl font-bold text-accent">
              FreshLens
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`${getNavClass(item.key)} cursor-pointer`}
              >
                {item.label}
                {activePage === item.key && (
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

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <p className="text-sm font-medium text-accent/70">Checking account...</p>
            ) : user ? (
              <>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                    {roleLabel}
                  </p>
                  <p className="max-w-48 truncate text-sm font-semibold text-primary">
                    Hi! {displayName}
                  </p>
                </div>
                <button
                  onClick={() => handleLogout()}
                  disabled={isLoggingOut}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="border border-primary text-primary hover:bg-primary/5 px-5 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </>
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
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`text-left cursor-pointer ${getNavClass(item.key)}`}
              >
                {activePage === item.key && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: '#285A53' }} />
                )}
                {item.label}
              </button>
            ))}
            {user ? (
              <div className="mt-2 space-y-2">
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                    {roleLabel}
                  </p>
                  <p className="text-sm font-semibold text-primary break-all">
                    Hi! {displayName}
                  </p>
                </div>
                <button
                  onClick={() => handleLogout({ closeMobile: true })}
                  disabled={isLoggingOut}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-center disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                  className="border border-primary text-primary hover:bg-primary/5 px-4 py-2.5 rounded-lg font-semibold transition-colors text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-center"
                >
                  Sign Up
                </button>
              </div>
            )}

            {logoutError && (
              <p className="text-xs font-medium text-rose-600">
                {logoutError}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Header
