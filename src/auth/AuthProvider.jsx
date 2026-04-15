import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthContext from './auth-context'

async function fetchUserRole(userId) {
  if (!userId) return null

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch role:', error.message)
  }

  return data?.role ?? null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to load auth session:', error.message)
      }

      if (!mounted) return

      const nextSession = data?.session ?? null
      const nextUser = nextSession?.user ?? null
      setSession(nextSession)
      setUser(nextUser)

      if (nextUser) {
        const nextRole = await fetchUserRole(nextUser.id)
        if (mounted) setRole(nextRole)
      } else {
        setRole(null)
      }

      if (mounted) setLoading(false)
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return

      const nextUser = nextSession?.user ?? null
      setSession(nextSession ?? null)
      setUser(nextUser)

      if (nextUser) {
        const nextRole = await fetchUserRole(nextUser.id)
        if (mounted) setRole(nextRole)
      } else {
        setRole(null)
      }

      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      loading,
      refreshRole: async () => {
        if (!user) {
          setRole(null)
          return null
        }

        const nextRole = await fetchUserRole(user.id)
        setRole(nextRole)
        return nextRole
      },
    }),
    [session, user, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
