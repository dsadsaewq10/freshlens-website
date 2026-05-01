import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import Footer from '../landingpage/components/Footer'
import BackToTop from '../../components/BackToTop'
import DatasetSidebar from './components/DatasetSidebar'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/useAuth'
import JSZip from 'jszip'

const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

// Login prompt modal for guest users
function LoginPromptModal({ isOpen, onClose, onLoginClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-110 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${COLORS.primary}15` }}>
              <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.primary }}>
              Login to Download
            </h3>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              You need to be logged in to download datasets. Sign in with your account to get started.
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose()
                  onLoginClick()
                }}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{ background: COLORS.primary }}
              >
                Go to Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Cancel
              </motion.button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helper functions
function releaseVegFromLabel(label) {
  if (!label) return 'Unknown'
  return label.split('_').slice(1).join(' ')
}

function releaseFreshFromLabel(label) {
  return (label ?? '').startsWith('Fresh')
}

function releaseParseJson(v) {
  if (v == null) return null
  if (Array.isArray(v) || typeof v === 'object') return v
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}

function captureDetections(cap) {
  const dets = releaseParseJson(cap.reviewed_detections) || releaseParseJson(cap.detections)
  if (Array.isArray(dets) && dets.length) return dets
  const l = cap.reviewed_box_left ?? cap.box_left
  const t = cap.reviewed_box_top ?? cap.box_top
  const r = cap.reviewed_box_right ?? cap.box_right
  const b = cap.reviewed_box_bottom ?? cap.box_bottom
  if (r == null || (r - l) <= 0.01) return []
  return [
    {
      classLabel: cap.reviewed_class_label || cap.class_label,
      boxLeft: l,
      boxTop: t,
      boxRight: r,
      boxBottom: b,
    },
  ]
}

function useApprovedCaptures(vegetables) {
  const [captures, setCaptures] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!vegetables?.length) return

    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    supabase
      .from('scan_history')
      .select(
        'id, class_label, is_fresh, scanned_image_path, detections,' +
          'box_left, box_top, box_right, box_bottom,' +
          'reviewed_class_label, reviewed_detections,' +
          'reviewed_box_left, reviewed_box_top, reviewed_box_right, reviewed_box_bottom'
      )
      .eq('review_status', 'approved')
      .then(({ data }) => {
        if (cancelled) return
        const rows = (data ?? []).filter((r) => {
          const veg = releaseVegFromLabel(r.reviewed_class_label || r.class_label)
          return vegetables.includes(veg)
        })
        setCaptures(rows)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [vegetables])

  return { captures, loading }
}

async function buildReleaseZip(release, captures, onProgress) {
  const zip = new JSZip()
  const root = zip.folder(`${release.name.replace(/\s+/g, '_')}_v${release.version}`)

  const labelSet = new Set()
  captures.forEach((c) => captureDetections(c).forEach((d) => labelSet.add(d.classLabel)))
  const classList = [...labelSet].sort()
  const classMap = Object.fromEntries(classList.map((c, i) => [c, i]))
  const names = classList.map((c, i) => `  ${i}: ${c}`).join('\n')

  root.file('data.yaml', `path: ./\ntrain: images/train\nval:   images/val\n\nnc: ${classList.length}\nnames:\n${names}\n`)

  const split = Math.round(captures.length * 0.8)
  const groups = { train: captures.slice(0, split), val: captures.slice(split) }
  let done = 0
  const total = captures.length

  for (const [splitName, caps] of Object.entries(groups)) {
    const imgDir = root.folder(`images/${splitName}`)
    const lblDir = root.folder(`labels/${splitName}`)

    for (let i = 0; i < caps.length; i++) {
      const cap = caps[i]
      const stem = `img_${splitName}_${String(i + 1).padStart(4, '0')}`

      try {
        const res = await fetch(cap.scanned_image_path)
        if (res.ok) {
          const blob = await res.blob()
          const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
          imgDir.file(`${stem}.${ext}`, blob)
        }
      } catch {}

      lblDir.file(`${stem}.txt`, '')
      done++
      onProgress?.(done, total)
    }
  }

  return zip.generateAsync({ type: 'blob' }, (meta) => onProgress?.(done, total, meta.percent))
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function DatasetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [release, setRelease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('data-card')
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const [lastDownloadAttempt, setLastDownloadAttempt] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { captures, loading: capturesLoading } = useApprovedCaptures(release?.vegetables)
  const previewUnavailable = !capturesLoading && captures.length === 0

  useEffect(() => {
    ;(async () => {
      const { data: releases } = await supabase
        .from('dataset_releases')
        .select('id, name, version, vegetables, sample_count, fresh_ratio, changelog, public_url, updated_at')
        .eq('status', 'Published')
        .eq('id', id)
        .single()

      if (releases) {
        const { data: sample } = await supabase
          .from('scan_history')
          .select('scanned_image_path, class_label, reviewed_class_label')
          .eq('review_status', 'approved')
          .limit(25)

        const vegetables = releases.vegetables ?? []
        const matchingSample = (sample ?? []).find((row) => {
          const label = row.reviewed_class_label || row.class_label
          const veg = releaseVegFromLabel(label)
          return vegetables.includes(veg)
        })

        releases.thumbnail_url = matchingSample?.scanned_image_path ?? sample?.[0]?.scanned_image_path ?? null
        setRelease(releases)
      }

      setLoading(false)
    })()
  }, [id])

  const handleDownloadAttempt = async () => {
    const now = Date.now()
    if (now - lastDownloadAttempt < 300) return

    setLastDownloadAttempt(now)

    if (!user) {
      setLoginPromptOpen(true)
      return
    }

    // Perform download
    if (!captures.length || downloading) return

    setDownloading(true)
    setProgress(0)

    try {
      const blob = await buildReleaseZip(release, captures, (done, total, zipPct) => {
        const filePct = total ? (done / total) * 80 : 0
        const zpct = (zipPct ?? 0) * 0.2
        setProgress(Math.min(99, Math.round(filePct + zpct)))
      })
      triggerDownload(blob, `${release.name.replace(/\s+/g, '_')}_v${release.version}.zip`)
      setProgress(100)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setTimeout(() => {
        setDownloading(false)
        setProgress(0)
      }, 800)
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  const byVeg = useMemo(() => {
    const g = {}
    for (const c of captures) {
      const veg = releaseVegFromLabel(c.reviewed_class_label || c.class_label)
      if (!g[veg]) g[veg] = []
      g[veg].push(c)
    }
    return g
  }, [captures])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: COLORS.primary }} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!release) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dataset not found</h1>
            <p className="text-gray-600 mb-6">The dataset you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/datasets')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ background: COLORS.primary }}>
              Back to Datasets
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

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

      <LoginPromptModal isOpen={loginPromptOpen} onClose={() => setLoginPromptOpen(false)} onLoginClick={handleLoginRedirect} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col w-full">
        <section className="px-6 md:px-8 lg:pl-12 lg:pr-8 py-8 border-b border-gray-200">
          <div className="w-full">
            <button onClick={() => navigate('/datasets')} className="flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: COLORS.primary }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Datasets
            </button>
          </div>
        </section>

        <section className="px-6 md:px-8 lg:pl-12 lg:pr-8 py-8 flex-1 w-full">
          {/* Main Layout: Content Left (flexible), Sidebar Right (fixed 340px) */}
          <div className="flex flex-col lg:grid gap-8 w-full" style={{ gridTemplateColumns: '1fr 340px' }}>
            {/* Left Column: Header, Tabs, Content */}
            <div className="min-w-0">
              {/* Title and Author Info */}
              <h1 className="text-4xl font-bold mb-6" style={{ color: COLORS.primary }}>
                {release.name}
              </h1>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: COLORS.primary }}>
                  {(release.name || 'D').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">FreshLens Team</p>
                  <p className="text-xs text-gray-500">Updated {new Date(release.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200 mb-6">
                {[
                  { id: 'data-card', label: 'Data Card' },
                  { id: 'code', label: 'Code' },
                  { id: 'comment', label: 'Comment' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 font-semibold transition-all ${activeTab === tab.id ? 'text-base border-b-2' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
                    style={{
                      color: activeTab === tab.id ? COLORS.primary : undefined,
                      borderColor: activeTab === tab.id ? COLORS.primary : 'transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="min-h-96">
                {activeTab === 'data-card' && (
                  <div className="space-y-5">
                    {release.changelog && (
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-sm text-blue-900">{release.changelog}</p>
                      </div>
                    )}

                    {capturesLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: COLORS.primary }} />
                      </div>
                    ) : previewUnavailable ? (
                      <div className="py-8 text-center space-y-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Preview images not available</p>
                        <p className="text-xs text-gray-500">This account cannot access preview data</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {Object.entries(byVeg).map(([veg, caps]) => (
                          <div key={veg}>
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                              📁 {veg.replace(' ', '_')}/ <span className="text-gray-500 font-normal">({caps.length} images)</span>
                            </p>
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                              {caps.slice(0, 24).map((cap) => {
                                const label = cap.reviewed_class_label || cap.class_label
                                const fresh = releaseFreshFromLabel(label)
                                return (
                                  <div key={cap.id} className="relative aspect-square">
                                    <img src={cap.scanned_image_path} alt={label} className="h-full w-full rounded-lg border border-gray-200 object-cover" loading="lazy" />
                                    <span className={`absolute bottom-0.5 right-0.5 rounded px-1 text-[8px] font-bold text-white ${fresh ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                      {fresh ? 'F' : 'R'}
                                    </span>
                                  </div>
                                )
                              })}
                              {caps.length > 24 && (
                                <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gray-300 text-[10px] text-gray-500 font-semibold">
                                  +{caps.length - 24}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                    <p className="text-sm">Code content coming soon</p>
                  </div>
                )}

                {activeTab === 'comment' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                    <p className="text-sm">Discussion coming soon</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Hero Image, Buttons and Metadata */}
            <div className="w-full lg:w-auto space-y-6">
              {/* Hero Image */}
              <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden sticky top-8" style={{ aspectRatio: '4/3' }}>
                {release.thumbnail_url ? (
                  <img src={release.thumbnail_url} alt={release.name} className="w-full h-auto object-cover block" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Code
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={downloading}
                  onClick={handleDownloadAttempt}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: COLORS.primary }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {downloading ? `Downloading ${progress}%` : 'Download'}
                </motion.button>
              </div>

              {/* Metadata */}
              <div className="space-y-5 pt-6 border-t-2 border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Usability</p>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                      {release.fresh_ratio ? (release.fresh_ratio * 10).toFixed(1) : '8.5'}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: COLORS.primary,
                        width: `${(release.fresh_ratio ? release.fresh_ratio * 100 : 85)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">License</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Attribution 4.0 International
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Update Frequency</p>
                  <p className="text-sm text-gray-700">Monthly</p>
                </div>

                {release.vegetables && release.vegetables.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {release.vegetables.map((veg) => (
                        <span key={veg} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {veg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{release.sample_count?.toLocaleString()}</span> images · v{release.version}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </div>
  )
}
