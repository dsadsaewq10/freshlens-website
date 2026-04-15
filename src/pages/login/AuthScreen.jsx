import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

const signupSchema = loginSchema.extend({
  name: z.string().min(1, 'Username is required.'),
})

function withTimeout(promise, timeoutMs, timeoutMessage) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage))
    }, timeoutMs)

    promise
      .then((value) => {
        clearTimeout(timeoutId)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

function AuthScreen({ mode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { authMode } = useParams()
  const navigate = useNavigate()

  const resolvedMode = mode === 'login' || mode === 'signup'
    ? mode
    : authMode === 'signup'
      ? 'signup'
      : 'login'

  const isLogin = resolvedMode === 'login'
  const title = isLogin ? 'Welcome to FreshLens' : 'Create your FreshLens account'
  const subtitle = isLogin
    ? 'Start your experience by signing in.'
    : 'Join FreshLens and start managing your produce intelligence.'
  const submitLabel = isLogin ? 'Sign In' : 'Sign Up'

  useEffect(() => {
    const previousHtmlOverflowX = document.documentElement.style.overflowX
    const previousHtmlOverflowY = document.documentElement.style.overflowY
    const previousBodyOverflowX = document.body.style.overflowX
    const previousBodyOverflowY = document.body.style.overflowY

    // Avoid global forced scrollbar and edge artifacts while on auth screen.
    document.documentElement.style.overflowX = 'hidden'
    document.documentElement.style.overflowY = 'hidden'
    document.body.style.overflowX = 'hidden'
    document.body.style.overflowY = 'hidden'

    return () => {
      document.documentElement.style.overflowX = previousHtmlOverflowX
      document.documentElement.style.overflowY = previousHtmlOverflowY
      document.body.style.overflowX = previousBodyOverflowX
      document.body.style.overflowY = previousBodyOverflowY
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function redirectAuthenticatedUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted || !session?.user) {
        return
      }

      if (!mounted) return

      navigate('/admin', { replace: true })
    }

    redirectAuthenticatedUser()

    return () => {
      mounted = false
    }
  }, [navigate])

  const fields = useMemo(() => {
    if (isLogin) {
      return [
        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email address' },
        {
          id: 'password',
          label: 'Password',
          type: showPassword ? 'text' : 'password',
          placeholder: 'Enter your password',
        },
      ]
    }

    return [
      {
        id: 'name',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
      },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email address' },
      {
        id: 'password',
        label: 'Password',
        type: showPassword ? 'text' : 'password',
        placeholder: 'Create a password',
      },
    ]
  }, [isLogin, showPassword])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      const schema = isLogin ? loginSchema : signupSchema
      schema.parse(formData)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrorMsg(err.errors[0].message)
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        let loginResult
        try {
          loginResult = await withTimeout(
            supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            }),
            12000,
            'Sign-in is taking too long. Please try again.',
          )
        } catch (signInErr) {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          // Session can be created even when the sign-in promise stalls in some network conditions.
          if (session?.user) {
            navigate('/admin')
            return
          }

          throw signInErr
        }

        const { error } = loginResult
        if (error) throw error
        navigate('/admin')
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { username: formData.name },
          },
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
        navigate('/login')
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f3f6f6]">
      <div className="grid h-full w-full overflow-hidden bg-white lg:grid-cols-2">
        <section className="flex flex-col p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-base font-semibold text-primary transition hover:bg-slate-50"
            >
              <span aria-hidden="true" className="text-2xl leading-none">&lt;</span>
            </Link>
            <div className="flex items-center gap-2.5 text-primary font-semibold text-lg sm:text-xl">
              <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
              <span>FreshLens</span>
            </div>
          </div>

          <motion.div
            key={resolvedMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto mt-7 w-full max-w-lg sm:mt-9"
          >
            <h1 className="min-h-20 text-center text-3xl font-bold text-[#0f4143] sm:text-4xl">{title}</h1>
            <p className="min-h-12 text-center text-sm text-slate-500 sm:text-base">{subtitle}</p>

            <div className="mt-8 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
              <Link
                to="/login"
                className={`rounded-xl py-3 text-center text-base font-semibold transition-colors ${
                  isLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`rounded-xl py-3 text-center text-base font-semibold transition-colors ${
                  !isLogin ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary'
                }`}
              >
                Sign Up
              </Link>
            </div>

            <form className="mx-auto mt-7 w-full max-w-md min-h-84 space-y-4" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-500">
                  {errorMsg}
                </div>
              )}
              {fields.map((field) => (
                <label
                  key={field.id}
                  className="block"
                >
                  <span className="mb-2 block text-base font-medium text-[#1f4f52]">{field.label} <span className="text-primary">*</span></span>
                  <div className="relative">
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      required
                    />
                    {field.id === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                </label>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-white transition hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : submitLabel}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500">Or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              {[
                { id: 'google', name: 'Google', icon: '/assets/icons/logo_google.png' },
                { id: 'facebook', name: 'Facebook', icon: '/assets/icons/logo_facebook.png' },
                { id: 'github', name: 'Github', icon: '/assets/icons/logo_github.png' },
              ].map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => supabase.auth.signInWithOAuth({ provider: provider.id })}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:border-primary"
                  aria-label={`Continue with ${provider.name}`}
                >
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="h-6 w-6 object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <div className="mt-6 pt-1 text-center text-xs text-slate-500 sm:mt-auto sm:pt-5 lg:pt-6">
            Copyright : FreshLens, All Rights Reserved
            <span className="mx-2 text-slate-300">|</span>
            <a href="#" className="text-primary hover:underline">Term & Condition</a>
            <span className="mx-2 text-slate-300">|</span>
            <a href="#" className="text-primary hover:underline">Privacy & Policy</a>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[linear-gradient(180deg,#0f6d76_0%,#074f56_52%,#04383f_100%)] p-10 xl:p-12 lg:block">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }} />

          <div className="relative h-full rounded-2xl border border-white/20 p-8">
            <div className="absolute left-20 top-16 w-96 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-2xl">
              <p className="text-xs font-semibold text-slate-500">Accuracy Level</p>
              <p className="mt-2 text-3xl font-bold text-[#0d5558]">94%</p>
              <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200">
                <div className="h-2.5 w-[94%] rounded-full bg-[#2aa4ad]" />
              </div>
            </div>

            <div className="absolute left-14 top-80 w-96 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-2xl">
              <p className="text-xs font-semibold text-slate-500">Dataset Growth</p>
              <p className="mt-2 text-2xl font-bold text-[#0d5558]">17,366 items</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 w-[68%] rounded-full bg-[#2aa4ad]" />
              </div>
            </div>

            <div className="absolute right-12 top-48 w-96 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-2xl">
              <p className="text-xs font-semibold text-slate-500">Prediction Batch</p>
              <p className="mt-1 text-lg font-bold text-[#0d5558]">Tomato | Grade A</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>45%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 w-[45%] rounded-full bg-[#2aa4ad]" />
              </div>
            </div>

            <div className="relative flex h-full flex-col items-center justify-end text-center">
              <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="mb-6 h-16 w-16 rounded-2xl bg-white/20 p-2" />
              <h2 className="max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
                An Open-Source Platform for Datasets
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/75">
                FreshLens brings image datasets, quality checks, and prediction workflows into one focused dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AuthScreen
