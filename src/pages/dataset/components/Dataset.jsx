import React, { useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Header from '../../landingpage/components/Header'
import Footer from '../../landingpage/components/Footer'
import BackToTop from '../../../components/BackToTop'
import { supabase } from '../../../lib/supabase'
import JSZip from 'jszip'

// Color palette
const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

// Dataset information
const datasets = [
  {
    id: 'cabbage',
    name: 'Cucumber Dataset',
    description:
      'Annotated images of cucumbers at various freshness stages, captured under controlled and natural lighting conditions. Each image is labeled with bounding boxes in YOLO format.',
    images: 2450,
    freshCount: 1280,
    rottenCount: 1170,
    classes: ['Fresh Cucumber', 'Rotten Cucumber'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~320 MB',
    thumbnail: '/assets/icons_vegetables/cucumber_transparent.png',
    sampleImages: ['/assets/sample_data/cucumber1.webp', '/assets/sample_data/cucumber2.jpg', '/assets/sample_data/cucumber3.jpg'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'tomato',
    name: 'Tomato Dataset',
    description:
      'A curated collection of tomato images classified into three freshness levels. Captured across different environments to ensure the model works well in real-world conditions.',
    images: 2800,
    freshCount: 1500,
    rottenCount: 1300,
    classes: ['Fresh Tomato', 'Rotten Tomato'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~380 MB',
    thumbnail: '/assets/icons_vegetables/tomato.png',
    sampleImages: ['/assets/sample_data/tomato1.jpg', '/assets/sample_data/tomato2.avif', '/assets/sample_data/tomato3.webp'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'carrot',
    name: 'Carrot Dataset',
    description:
      'Comprehensive carrot image dataset featuring four freshness categories. Images include whole carrots and cross-sections for thorough classification training.',
    images: 2100,
    freshCount: 1120,
    rottenCount: 980,
    classes: ['Fresh Carrot', 'Rotten Carrot'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~290 MB',
    thumbnail: '/assets/icons_vegetables/carrot.png',
    sampleImages: ['/assets/sample_data/carrot1.webp', '/assets/sample_data/carrot2.webp', '/assets/sample_data/carrot3.webp'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'pepper',
    name: 'Pepper Dataset',
    description:
      'Bell pepper images annotated with five distinct freshness levels. The dataset covers green, red, and yellow pepper varieties for comprehensive detection.',
    images: 2005,
    freshCount: 1050,
    rottenCount: 955,
    classes: ['Fresh Pepper', 'Rotten Pepper'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~270 MB',
    thumbnail: '/assets/icons_vegetables/pepper.png',
    sampleImages: ['/assets/sample_data/pepper1.webp', '/assets/sample_data/pepper2.jpg', '/assets/sample_data/pepper3.jpg'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
]

// Aggregate stats
const totalImages = datasets.reduce((sum, d) => sum + d.images, 0)
const totalClasses = [...new Set(datasets.flatMap((d) => d.classes))].length
const totalVegetables = datasets.length

// Dataset preview modal
function DatasetModal({ dataset, isOpen, onClose }) {
  if (!dataset) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with thumbnail */}
            <div className="relative h-36 md:h-40 overflow-hidden rounded-t-2xl" style={{ background: COLORS.primary }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={dataset.thumbnail}
                  alt={dataset.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/40 to-transparent">
                <h2 className="text-xl md:text-2xl font-bold text-white">{dataset.name}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{dataset.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
                {[
                  { value: dataset.images.toLocaleString(), label: 'Total Images' },
                  { value: dataset.classes.length, label: 'Classes' },
                  { value: dataset.resolution, label: 'Resolution' },
                  { value: dataset.size, label: 'Dataset Size' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl p-2.5 text-center" style={{ background: COLORS.light }}>
                    <p className="text-lg md:text-xl font-bold" style={{ color: COLORS.primary }}>{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Classes */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.medium }}>
                  Freshness Classes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.classes.map((cls, i) => (
                    <span
                      key={cls}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: i === 0 ? `${COLORS.primary}15` : i === dataset.classes.length - 1 ? '#fee2e2' : '#f3f4f6',
                        color: i === 0 ? COLORS.primary : i === dataset.classes.length - 1 ? '#dc2626' : '#374151',
                      }}
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample images */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.medium }}>
                  Sample Images
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-4/3 rounded-xl overflow-hidden border border-gray-200"
                      style={{ background: COLORS.light }}
                    >
                      {dataset.sampleImages[i] ? (
                        <img
                          src={dataset.sampleImages[i]}
                          alt={`Sample ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3">
                          <svg className="w-6 h-6 mx-auto mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <p className="text-[10px] text-gray-400">Sample {i + 1}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-col sm:flex-row gap-2.5 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Format: {dataset.format}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Updated: {dataset.lastUpdated}
                </div>
              </div>

              {/* Download button */}
              <motion.a
                href={dataset.downloadUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: COLORS.primary }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Dataset
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hero section (plays on mount only)
function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden snap-start"
      style={{ background: COLORS.light }}
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${COLORS.primary} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}
          >
            Open Source Datasets
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
            style={{ color: COLORS.primary }}
          >
            Training Data for{' '}
            <span style={{ color: COLORS.medium }}>Freshness Detection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-600 mb-10 leading-relaxed"
          >
            Browse and download the annotated vegetable image datasets used to
            train FreshLens. All datasets are freely available for research and
            development purposes.
          </motion.p>

          {/* Aggregate stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: `${totalImages.toLocaleString()}+`, label: 'Total Images' },
              { value: totalVegetables, label: 'Vegetables' },
              { value: totalClasses, label: 'Unique Classes' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-13 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs font-medium" style={{ color: COLORS.medium }}>
            Scroll to explore
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
    </section>
  )
}

// ── Release helpers (shared with admin-db/dataset-release) ────────────────────
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
  try { return JSON.parse(v) } catch { return null }
}
function captureDetections(cap) {
  const dets = releaseParseJson(cap.reviewed_detections) || releaseParseJson(cap.detections)
  if (Array.isArray(dets) && dets.length) return dets
  const l = cap.reviewed_box_left ?? cap.box_left
  const t = cap.reviewed_box_top  ?? cap.box_top
  const r = cap.reviewed_box_right ?? cap.box_right
  const b = cap.reviewed_box_bottom ?? cap.box_bottom
  if (r == null || (r - l) <= 0.01) return []
  return [{
    classLabel: cap.reviewed_class_label || cap.class_label,
    boxLeft: l, boxTop: t, boxRight: r, boxBottom: b,
  }]
}
function captureToYoloText(cap, classMap) {
  return captureDetections(cap)
    .filter(d => d.classLabel && d.boxRight != null && (d.boxRight - d.boxLeft) > 0.01)
    .map(d => {
      const cx = ((d.boxLeft + d.boxRight) / 2).toFixed(6)
      const cy = ((d.boxTop + d.boxBottom) / 2).toFixed(6)
      const w  = (d.boxRight - d.boxLeft).toFixed(6)
      const h  = (d.boxBottom - d.boxTop).toFixed(6)
      return `${classMap[d.classLabel] ?? 0} ${cx} ${cy} ${w} ${h}`
    }).join('\n')
}

function useApprovedCaptures(vegetables) {
  const [captures, setCaptures] = useState([])
  const [loading, setLoading]   = useState(false)
  useEffect(() => {
    let cancelled = false
    if (!vegetables?.length) return
    queueMicrotask(() => { if (!cancelled) setLoading(true) })
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
        const rows = (data ?? []).filter(r => {
          const veg = releaseVegFromLabel(r.reviewed_class_label || r.class_label)
          return vegetables.includes(veg)
        })
        setCaptures(rows)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [vegetables])
  return { captures, loading }
}

async function buildReleaseZip(release, captures, onProgress) {
  const zip = new JSZip()
  const root = zip.folder(`${release.name.replace(/\s+/g, '_')}_v${release.version}`)
  // data.yaml
  const labelSet = new Set()
  captures.forEach(c => captureDetections(c).forEach(d => labelSet.add(d.classLabel)))
  const classList = [...labelSet].sort()
  const classMap  = Object.fromEntries(classList.map((c, i) => [c, i]))
  const names = classList.map((c, i) => `  ${i}: ${c}`).join('\n')
  root.file('data.yaml',
    `path: ./\ntrain: images/train\nval:   images/val\n\nnc: ${classList.length}\nnames:\n${names}\n`)

  // 80/20 split
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
          const ext  = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
          imgDir.file(`${stem}.${ext}`, blob)
        }
      } catch { /* skip missing */ }
      lblDir.file(`${stem}.txt`, captureToYoloText(cap, classMap))
      done++
      onProgress?.(done, total)
    }
  }
  return zip.generateAsync({ type: 'blob' }, (meta) =>
    onProgress?.(done, total, meta.percent)
  )
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Release preview modal ─────────────────────────────────────────────────────
function ReleasePreviewModal({ release, onClose }) {
  const { captures, loading } = useApprovedCaptures(release.vegetables)
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleDownload() {
    if (!captures.length || downloading) return
    setDownloading(true); setProgress(0)
    try {
      const blob = await buildReleaseZip(release, captures, (done, total, zipPct) => {
        const filePct = total ? (done / total) * 80 : 0
        const zpct    = (zipPct ?? 0) * 0.2
        setProgress(Math.min(99, Math.round(filePct + zpct)))
      })
      triggerDownload(blob, `${release.name.replace(/\s+/g, '_')}_v${release.version}.zip`)
      setProgress(100)
    } finally {
      setTimeout(() => { setDownloading(false); setProgress(0) }, 800)
    }
  }

  // group captures by vegetable for folder tree view
  const byVeg = useMemo(() => {
    const g = {}
    for (const c of captures) {
      const veg = releaseVegFromLabel(c.reviewed_class_label || c.class_label)
      if (!g[veg]) g[veg] = []
      g[veg].push(c)
    }
    return g
  }, [captures])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h3 className="text-lg font-bold" style={{ color: COLORS.primary }}>{release.name}</h3>
            <p className="text-xs text-slate-500">
              v{release.version} · {captures.length} images · {release.vegetables?.join(', ')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {release.changelog && (
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">{release.changelog}</p>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: COLORS.primary }} />
            </div>
          ) : captures.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No approved captures in this release yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(byVeg).map(([veg, caps]) => (
                <div key={veg}>
                  <p className="mb-2 text-xs font-semibold text-slate-500">
                    📁 {veg.replace(' ', '_')}/ <span className="text-slate-400">({caps.length} images)</span>
                  </p>
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                    {caps.slice(0, 24).map((cap) => {
                      const label = cap.reviewed_class_label || cap.class_label
                      const fresh = releaseFreshFromLabel(label)
                      const dets  = captureDetections(cap)
                      return (
                        <div key={cap.id} className="relative aspect-square">
                          <img
                            src={cap.scanned_image_path}
                            alt={label}
                            className="h-full w-full rounded-lg border border-slate-200 object-cover"
                            loading="lazy"
                          />
                          {dets.length > 0 && (
                            <svg viewBox="0 0 1 1" preserveAspectRatio="none"
                                 className="pointer-events-none absolute inset-0 h-full w-full rounded-lg">
                              {dets.map((d, i) => {
                                if (d.boxRight == null || (d.boxRight - d.boxLeft) <= 0.01) return null
                                const isF = releaseFreshFromLabel(d.classLabel)
                                return (
                                  <rect key={i}
                                    x={d.boxLeft} y={d.boxTop}
                                    width={d.boxRight - d.boxLeft} height={d.boxBottom - d.boxTop}
                                    fill="none" stroke={isF ? '#10b981' : '#ef4444'}
                                    strokeWidth={0.025} vectorEffect="non-scaling-stroke" />
                                )
                              })}
                            </svg>
                          )}
                          <span className={`absolute bottom-0.5 right-0.5 rounded px-1 text-[8px] font-bold text-white ${fresh ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {fresh ? 'F' : 'R'}
                          </span>
                        </div>
                      )
                    })}
                    {caps.length > 24 && (
                      <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
                        +{caps.length - 24}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={!captures.length || downloading}
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: COLORS.primary }}
            >
              {downloading ? (
                <>Building ZIP… {progress}%</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download .zip ({captures.length} imgs)
                </>
              )}
            </button>
            <p className="text-xs text-slate-400">Bundled in YOLO format — data.yaml + images/ + labels/</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dataset grid section — animations replay
function DatasetGridSection({ publishedReleases = [], loadingReleases = false, onPreview }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.darker }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full" style={{ background: `${COLORS.primary}08` }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full" style={{ background: `${COLORS.primary}08` }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
            Available Datasets
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
            Choose a Dataset
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Click on any dataset card to preview sample images, view statistics,
            and download the full dataset.
          </p>
        </motion.div>

        {/* Published community releases */}
        {!loadingReleases && publishedReleases.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: COLORS.medium }}>
              Community Releases
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {publishedReleases.map((release, i) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.6 }}
                  onClick={() => onPreview?.(release)}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {release.thumbnail_url ? (
                      <img
                        src={release.thumbnail_url}
                        alt={release.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg"
                        style={{ background: COLORS.primary }}
                      >
                        {(release.name || 'R').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold truncate" style={{ color: COLORS.primary }}>{release.name}</h3>
                        <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${COLORS.primary}15`, color: COLORS.medium }}>
                          v{release.version}
                        </span>
                      </div>
                      {release.changelog && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-2.5">{release.changelog}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                        {release.sample_count > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {release.sample_count.toLocaleString()} images
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          YOLO format
                        </span>
                        {release.vegetables?.length > 0 && (
                          <span>{release.vegetables.join(', ')}</span>
                        )}
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: COLORS.primary }}
                        onClick={(e) => { e.stopPropagation(); onPreview?.(release) }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview & download
                      </motion.button>
                    </div>
                    <span className="shrink-0 self-start mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                        Published
                      </span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loadingReleases && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: COLORS.primary }} />
          </div>
        )}

        {/* Empty state — no published releases yet */}
        {!loadingReleases && publishedReleases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${COLORS.primary}12` }}>
              <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: COLORS.primary }}>No datasets published yet</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Datasets approved by the FreshLens team will appear here once published. Check back soon.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Dataset statistics section — animations replay
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  const maxImages = Math.max(...datasets.map((d) => d.images))

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.primary }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-white/10 text-white/80">
            Dataset Analytics
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            By the Numbers
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            A visual breakdown of our dataset composition and distribution
            across vegetable types and freshness levels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-5">Image Distribution</h3>
            <div className="space-y-4">
              {datasets.map((d, i) => (
                <div key={d.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white/80">{d.name.replace(' Dataset', '')}</span>
                    <span className="text-sm font-bold text-white">{d.images.toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(d.images / maxImages) * 100}%` } : { width: 0 }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `rgba(255,255,255,${0.4 + i * 0.15})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Classes per vegetable */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-2">Classes per Vegetables</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: '#86efac' }} />
                <span className="text-xs text-white/70">Fresh</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: '#fca5a5' }} />
                <span className="text-xs text-white/70">Rotten</span>
              </div>
            </div>
            <div className="space-y-4">
              {datasets.map((dataset, i) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white/80">
                      {dataset.name.replace(' Dataset', '')}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {dataset.images.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(dataset.freshCount / dataset.images) * 100}%` } : { width: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                      className="h-full"
                      style={{ background: '#86efac' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(dataset.rottenCount / dataset.images) * 100}%` } : { width: 0 }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                      className="h-full"
                      style={{ background: '#fca5a5' }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#86efac' }}>
                      Fresh: {dataset.freshCount.toLocaleString()}
                    </span>
                    <span className="text-xs" style={{ color: '#fca5a5' }}>
                      Rotten: {dataset.rottenCount.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Dataset format section — animations replay
function FormatSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  const formatFeatures = [
    {
      title: 'YOLO Annotation Format',
      description:
        'Each image has a matching text file with bounding box coordinates. This tells the AI exactly where the vegetable is and what freshness level it has.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Train / Val / Test Split',
      description:
        'Datasets are pre-divided into training (70%), validation (20%), and test (10%) sets so you can start working with them right away.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: 'Consistent Resolution',
      description:
        'All images are resized to 640x640 pixels to match what the AI model expects. Original proportions are preserved with padding.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
    },
    {
      title: 'Augmentation Ready',
      description:
        'Base images can be enhanced with rotation, flipping, and brightness changes to create more training variations and improve model robustness.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ]

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.light }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: `${COLORS.primary}12`, color: COLORS.primary }}
          >
            Dataset Structure
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
            Ready-to-Use Format
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            All datasets follow a standardized structure for seamless
            integration with YOLOv8 and other detection frameworks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formatFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${COLORS.primary}10`, color: COLORS.primary }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: COLORS.primary }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Directory structure preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.medium }}>
              Directory Structure
            </h3>
            <div
              className="font-mono text-sm leading-7 rounded-xl p-5"
              style={{ background: COLORS.primary, color: 'rgba(255,255,255,0.85)' }}
            >
              <div className="text-green-300">dataset/</div>
              <div className="ml-4">
                <span className="text-blue-300">train/</span>
                <div className="ml-4 text-white/60">
                  <div>images/</div>
                  <div className="ml-4 text-white/40">img_001.jpg</div>
                  <div className="ml-4 text-white/40">img_002.jpg</div>
                  <div>labels/</div>
                  <div className="ml-4 text-white/40">img_001.txt</div>
                  <div className="ml-4 text-white/40">img_002.txt</div>
                </div>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">val/</span>
                <span className="text-white/40 ml-2">...</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">test/</span>
                <span className="text-white/40 ml-2">...</span>
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">data.yaml</span>
              </div>
            </div>
            <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-mono text-gray-500">
                <span className="text-gray-700 font-semibold">Annotation format:</span>{' '}
                &lt;class_id&gt; &lt;center_x&gt; &lt;center_y&gt; &lt;width&gt; &lt;height&gt;
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Example: 0 0.512 0.487 0.324 0.418
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Main Dataset Page
export default function DatasetPage() {
  const [publishedReleases, setPublishedReleases] = useState([])
  const [loadingReleases, setLoadingReleases] = useState(true)
  const [previewRelease, setPreviewRelease] = useState(null)

  useEffect(() => {
    (async () => {
      const { data: releases } = await supabase
        .from('dataset_releases')
        .select('id, name, version, vegetables, sample_count, fresh_ratio, changelog, public_url, updated_at')
        .eq('status', 'Published')
        .order('updated_at', { ascending: false })
      const rows = releases ?? []
      // Attach first-image thumbnail per release
      await Promise.all(rows.map(async (r) => {
        if (!r.vegetables?.length) return
        const { data: sample } = await supabase
          .from('scan_history')
          .select('scanned_image_path, class_label, reviewed_class_label')
          .eq('review_status', 'approved')
          .limit(10)
        const match = (sample ?? []).find(s => {
          const veg = releaseVegFromLabel(s.reviewed_class_label || s.class_label)
          return r.vegetables.includes(veg)
        })
        r.thumbnail_url = match?.scanned_image_path ?? null
      }))
      setPublishedReleases(rows)
      setLoadingReleases(false)
    })()
  }, [])

  useEffect(() => {
    const html = document.documentElement
    html.style.scrollSnapType = 'y mandatory'
    html.style.overflowY = 'scroll'
    html.style.scrollBehavior = 'smooth'
    window.scrollTo(0, 0)
    return () => {
      html.style.scrollSnapType = ''
      html.style.overflowY = ''
      html.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="bg-background">
      <Header currentPage="dataset" />
      <HeroSection />
      <DatasetGridSection
        publishedReleases={publishedReleases}
        loadingReleases={loadingReleases}
        onPreview={setPreviewRelease}
      />
      {previewRelease && (
        <ReleasePreviewModal
          release={previewRelease}
          onClose={() => setPreviewRelease(null)}
        />
      )}
      <FormatSection />
      <div className="snap-section-footer">
        <Footer />
      </div>
      <BackToTop />
    </div>
  )
}
