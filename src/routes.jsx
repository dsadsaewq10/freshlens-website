import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './auth/Landingpage'
import TechnologyPage from './pages/technology/components/Technology'
import DatasetPage from './pages/dataset/components/Dataset'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/dataset" element={<DatasetPage />} />
      </Routes>
    </Router>
  )
}
