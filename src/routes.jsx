import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './features/auth/pages/Landingpage'
export default function routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
      </Routes>
    </Router>
  )
}
