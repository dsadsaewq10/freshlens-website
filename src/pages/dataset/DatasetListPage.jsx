import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Footer from '../landingpage/components/Footer'
import BackToTop from '../../components/BackToTop'
import DatasetSidebar from './components/DatasetSidebar'
import { supabase } from '../../lib/supabase'

const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

const CATEGORIES = [
  'All datasets',
  'Computer Science',
  'Education',
  'Classification',
  'Computer Vision',
  'NLP',
  'Data Visualization',
  'Pre-Trained Model',
]

export default function DatasetListPage() {
  const navigate = useNavigate()
  const [publishedReleases, setPublishedReleases] = useState([])
  const [loadingReleases, setLoadingReleases] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All datasets')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: releases } = await supabase
        .from('dataset_releases')
        .select('id, name, version, vegetables, sample_count, fresh_ratio, changelog, public_url, updated_at')
        .eq('status', 'Published')
        .order('updated_at', { ascending: false })

      const rows = releases ?? []

      // Attach first-image thumbnail per release
      await Promise.all(
        rows.map(async (r) => {
          if (!r.vegetables?.length) return
          const { data: sample } = await supabase
            .from('scan_history')
            .select('scanned_image_path, class_label, reviewed_class_label')
            .eq('review_status', 'approved')
            .limit(10)
          const match = (sample ?? []).find((s) => {
            const veg = (s.reviewed_class_label || s.class_label || '').split('_').slice(1).join(' ')
            return r.vegetables.includes(veg)
          })
          r.thumbnail_url = match?.scanned_image_path ?? null
        })
      )

      setPublishedReleases(rows)
      setLoadingReleases(false)
    })()
  }, [])

  const filteredReleases = useMemo(() => {
    return publishedReleases.filter((release) => {
      const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        activeCategory === 'All datasets' ||
        release.vegetables?.some((veg) => veg.toLowerCase().includes(activeCategory.toLowerCase()))
      return matchesSearch && matchesCategory
    })
  }, [publishedReleases, searchQuery, activeCategory])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sidebar - Handles both desktop and mobile */}
      <DatasetSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Hamburger Button (visible only on small screens) */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 flex-1 flex flex-col w-full">
        {/* Header Section */}
        <section className="px-6 md:px-8 lg:pl-12 lg:pr-8 py-12 md:py-16 border-b border-gray-200">
          <div className="max-w-full">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
                  Datasets
                </h1>
                <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
                  Explore, analyze, and share quality data. <a href="#" className="font-semibold hover:underline" style={{ color: COLORS.primary }}>Learn more</a> about data types, creating, and collaborating.
                </p>
              </div>

              {/* Right side illustration placeholder */}
              <div className="hidden md:flex md:w-64 md:h-48 items-center justify-center">
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center text-gray-300"
                  style={{ background: `${COLORS.primary}10` }}
                >
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="px-6 md:px-8 lg:pl-12 lg:pr-8 py-8 border-b border-gray-200">
          <div className="max-w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search datasets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ focusRingColor: `${COLORS.primary}40` }}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-gray-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  activeCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  background: activeCategory === category ? COLORS.primary : undefined,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Datasets Grid */}
      <section className="px-6 md:px-8 lg:pl-12 lg:pr-8 py-12 flex-1">
        <div className="max-w-full">
          {loadingReleases ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: COLORS.primary }} />
            </div>
          ) : filteredReleases.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-1">No datasets found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReleases.map((release, idx) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/datasets/${release.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {release.thumbnail_url ? (
                      <img src={release.thumbnail_url} alt={release.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold flex-1" style={{ color: COLORS.primary }}>
                        {release.name}
                      </h3>
                      <span className="ml-2 px-2 py-1 rounded text-xs font-mono" style={{ background: `${COLORS.primary}15`, color: COLORS.medium }}>
                        v{release.version}
                      </span>
                    </div>

                    {release.changelog && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{release.changelog}</p>}

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {release.sample_count > 0 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {release.sample_count.toLocaleString()} images
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        YOLO format
                      </div>
                      <div className="text-xs">Updated {new Date(release.updated_at).toLocaleDateString()}</div>
                    </div>

                    {/* Tags */}
                    {release.vegetables?.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {release.vegetables.slice(0, 2).map((veg) => (
                            <span key={veg} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              {veg}
                            </span>
                          ))}
                          {release.vegetables.length > 2 && <span className="px-2 py-1 text-xs text-gray-500">+{release.vegetables.length - 2}</span>}
                        </div>
                      </div>
                    )}

                    {/* Footer stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: COLORS.primary }}>
                            F
                          </div>
                        </div>
                        <span className="text-gray-600">19</span>
                      </div>
                      <span className="text-gray-500">177 downloads</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
      </div>
    </div>
  )
}
