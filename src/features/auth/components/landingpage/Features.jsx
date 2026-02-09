import React from 'react'
import SyncIcon from '@mui/icons-material/Sync'
import SettingsIcon from '@mui/icons-material/Settings'
import ShieldIcon from '@mui/icons-material/Shield'
import BarChartIcon from '@mui/icons-material/BarChart'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import FilterListIcon from '@mui/icons-material/FilterList'

function Features() {
  return (
    <section className="bg-offwhite py-20 px-40">
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-primary mb-6">FreshLens</h2>
        <p className="text-gray-700 text-lg">
          The ultimate platform for AI-powered freshness detection enhanced with
          cutting-edge YOLO deep learning technology.
        </p>
      </div>


      <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">

        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <SyncIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">Real-Time Scanning</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            Instant freshness analysis using YOLO deep learning model with 
            sub-second accuracy for immediate results.
          </p>
        </div>

        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <SettingsIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">Dataset Management</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            Centralized interface for accessing 9,355+ annotated vegetable images 
            with smart classification and organization tools.
          </p>
        </div>


        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <ShieldIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">High Accuracy Models</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            89% average accuracy across all vegetable classes featuring 
            top-tier trained models and reliable predictions.
          </p>
        </div>


        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <BarChartIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">Performance Insights</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            Live analytics and visual representation of detection results with 
            predictive insights to enhance efficiency.
          </p>
        </div>
        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <RocketLaunchIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">Easy Integration</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            AI-driven API transitions ensuring no downtime with seamless 
            alignment to your existing workflow.
          </p>
        </div>
        <div className="bg-primary rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
            <FilterListIcon className="text-primary" sx={{ fontSize: 28 }} />
          </div>
          <h3 className="text-xl font-bold text-offwhite">Multi-Class Detection</h3>
          <p className="text-green-100 leading-relaxed text-sm">
            Adaptive classification system with 3-5 freshness levels that 
            evolves based on usage patterns for improved efficiency.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Features
