import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-background text-accent flex items-center justify-center px-4">
      <p className="text-sm font-medium text-accent/75">Checking access...</p>
    </div>
  )
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function RequireRole({ allowedRoles = [], children }) {
  const { user, role, loading, roleLoading } = useAuth()
  const location = useLocation()

  if (loading || roleLoading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const normalizedRole = (role ?? '').toLowerCase()
  const allowed = allowedRoles.map((value) => value.toLowerCase())

  if (!allowed.includes(normalizedRole)) {
    return <Navigate to="/dataset" replace />
  }

  return children
}
