import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthContext from './auth-context'

const ROLE_QUERY_TIMEOUT_MS = 2500

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

function getRoleFromClaims(user) {
  return typeof user?.app_metadata?.role === 'string' ? user.app_metadata.role : null
}

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
  const [roleLoading, setRoleLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    async function resolveRole(nextUser) {
      if (!nextUser) {
        if (mounted) {
          setRole(null)
          setRoleLoading(false)
        }
        return
      }

      const claimRole = getRoleFromClaims(nextUser)

      if (mounted && claimRole) {
        setRole(claimRole)
      }

      if (mounted) {
        setRoleLoading(true)
      }

      try {
        const dbRole = await withTimeout(
          fetchUserRole(nextUser.id),
          ROLE_QUERY_TIMEOUT_MS,
          'Role lookup timed out',
        )

        if (!mounted) return
        setRole(dbRole ?? claimRole ?? null)
      } catch {
        if (!mounted) return
        // Fallback to token claim role when role table lookup is slow/unavailable.
        setRole((currentRole) => currentRole ?? claimRole ?? null)
      } finally {
        if (mounted) {
          setRoleLoading(false)
        }
      }
    }

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
      setLoading(false)

      void resolveRole(nextUser)
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return

      const nextUser = nextSession?.user ?? null
      setSession(nextSession ?? null)
      setUser(nextUser)
      setLoading(false)

      void resolveRole(nextUser)
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
      roleLoading,
      refreshRole: async () => {
        if (!user) {
          setRole(null)
          setRoleLoading(false)
          return null
        }

        const claimRole = getRoleFromClaims(user)
        if (claimRole) {
          setRole(claimRole)
        }

        setRoleLoading(true)

        try {
          const nextRole = await withTimeout(
            fetchUserRole(user.id),
            ROLE_QUERY_TIMEOUT_MS,
            'Role lookup timed out',
          )
          setRole(nextRole ?? claimRole ?? null)
          return nextRole ?? claimRole ?? null
        } catch {
          setRole((currentRole) => currentRole ?? claimRole ?? null)
          return claimRole ?? null
        } finally {
          setRoleLoading(false)
        }
      },
    }),
    [session, user, role, loading, roleLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
