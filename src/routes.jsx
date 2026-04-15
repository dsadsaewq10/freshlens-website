import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landingpage from './auth/Landingpage'
import TechnologyPage from './pages/technology/components/Technology'
import DatasetPage from './pages/dataset/components/Dataset'
import AuthScreen from './pages/login/AuthScreen'
import AdminDashboard from './admin'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth, RequireRole } from './auth/ProtectedRoutes'

function AdminGuard() {
  return (
    <RequireRole allowedRoles={['admin']}>
      <AdminDashboard />
    </RequireRole>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route
            path="/dataset"
            element={(
              <RequireAuth>
                <DatasetPage />
              </RequireAuth>
            )}
          />
          {/* Redirect bare /admin to the default tab */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/:tab" element={<AdminGuard />} />
          <Route path="/:authMode" element={<AuthScreen />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
