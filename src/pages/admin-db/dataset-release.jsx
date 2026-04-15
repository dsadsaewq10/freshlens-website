/**
 * Dataset Release
 *
 * Two independent concepts:
 *  - Approved Pool  = every scan_history row where review_status = 'approved'
 *                     These are the raw annotated images available for training.
 *  - Release        = a named, versioned snapshot stored in the `dataset_releases`
 *                     table. A release bundles a subset of the pool (filtered by
 *                     vegetable) and, when published, exposes a public download URL
 *                     that appears on the landing page.
 */
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

// ── helpers ──────────────────────────────────────────────────────────────────
const ALL_CLASSES = [
  'Fresh_Cabbage','Fresh_Carrot','Fresh_Cucumber','Fresh_Pepper',
  'Fresh_Potato','Fresh_Tomato','Rotten_Cabbage','Rotten_Carrot',
  'Rotten_Cucumber','Rotten_Pepper','Rotten_Potato','Rotten_Tomato',
  'Fresh_Garlic','Rotten_Garlic','Fresh_Broccoli','Rotten_Broccoli',
  'Fresh_Eggplant','Rotten_Eggplant','Fresh_NapaCabbage','Rotten_NapaCabbage',
  'Fresh_Onion','Rotten_Onion',
]

function parseJson(v) {
  if (!v) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return null }
}

function vegFromLabel(label) {
  if (!label) return 'Unknown'
  return label.split('_').slice(1).join(' ')
}

function freshFromLabel(label) {
  return (label ?? '').startsWith('Fresh')
}

function statusPill(s) {
  if (s === 'Published') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Review')    return 'bg-sky-100 text-sky-700'
  if (s === 'Draft')     return 'bg-amber-100 text-amber-700'
  return 'bg-slate-200 text-slate-600'
}

// ── YOLO helpers ──────────────────────────────────────────────────────────────
function buildDataYaml(classesInRelease) {
  const names = classesInRelease.map((c, i) => `  ${i}: ${c}`).join('\n')
  return `path: ./dataset\ntrain: images/train\nval:   images/val\n\nnc: ${classesInRelease.length}\nnames:\n${names}`
}

function captureToYoloLines(capture, classMap) {
  const dets = parseJson(capture.reviewedDetections) ||
    (capture.reviewedClassLabel
      ? [{ classLabel: capture.reviewedClassLabel,
           boxLeft: capture.reviewedBoxLeft ?? capture.boxLeft,
           boxTop:  capture.reviewedBoxTop  ?? capture.boxTop,
           boxRight: capture.reviewedBoxRight ?? capture.boxRight,
           boxBottom: capture.reviewedBoxBottom ?? capture.boxBottom }]
      : null) ||
    parseJson(capture.detections) ||
    [{ classLabel: capture.classLabel,
       boxLeft: capture.boxLeft, boxTop: capture.boxTop,
       boxRight: capture.boxRight, boxBottom: capture.boxBottom }]

  return (dets ?? [])
    .filter(d => d.classLabel && d.boxRight != null && (d.boxRight - d.boxLeft) > 0.01)
    .map(d => {
      const cx = ((d.boxLeft + d.boxRight) / 2).toFixed(6)
      const cy = ((d.boxTop + d.boxBottom) / 2).toFixed(6)
      const w  = (d.boxRight - d.boxLeft).toFixed(6)
      const h  = (d.boxBottom - d.boxTop).toFixed(6)
      return `${classMap[d.classLabel] ?? 0} ${cx} ${cy} ${w} ${h}`
    }).join('\n')
}

// ── Pool Stats helper ─────────────────────────────────────────────────────────
function groupCaptures(captures) {
  const g = {}
  for (const c of captures) {
    const label = c.reviewedClassLabel || c.classLabel
    const veg   = vegFromLabel(label)
    if (!g[veg]) g[veg] = { total: 0, fresh: 0, rotten: 0, classes: new Set() }
    g[veg].total++
    if (freshFromLabel(label)) g[veg].fresh++; else g[veg].rotten++
    g[veg].classes.add(label)
  }
  return g
}

// ── Pool Details Popup ────────────────────────────────────────────────────────
// Shows the approved captures relevant to one release (or all if vegetables=[])
// The YOLO folder tree is interactive: click a vegetable folder to see captures.
function PoolPopup({ title, captures, vegetables, onClose }) {
  const [expandedNodes, setExpandedNodes] = useState({}) // key: "type/split/veg" → bool
  const [activeTab, setActiveTab] = useState('tree') // 'tree' | 'yaml'

  // Filter by vegetable if specified
  const relevant = useMemo(() => {
    if (!vegetables?.length) return captures
    return captures.filter(c => {
      const veg = vegFromLabel(c.reviewedClassLabel || c.classLabel)
      return vegetables.includes(veg)
    })
  }, [captures, vegetables])

  const groups = useMemo(() => groupCaptures(relevant), [relevant])

  // captures grouped by veg name for fast lookup
  const capturesByVeg = useMemo(() => {
    const m = {}
    for (const c of relevant) {
      const veg = vegFromLabel(c.reviewedClassLabel || c.classLabel)
      ;(m[veg] = m[veg] ?? []).push(c)
    }
    return m
  }, [relevant])

  const classesInPool = useMemo(() => {
    const s = new Set()
    for (const c of relevant) s.add(c.reviewedClassLabel || c.classLabel)
    return [...s].filter(Boolean).sort((a, b) => ALL_CLASSES.indexOf(a) - ALL_CLASSES.indexOf(b))
  }, [relevant])

  const classMap = useMemo(() => {
    const m = {}
    classesInPool.forEach((c, i) => { m[c] = i })
    return m
  }, [classesInPool])

  const dataYaml = useMemo(() => buildDataYaml(classesInPool), [classesInPool])

  function toggleNode(key) {
    setExpandedNodes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function downloadManifest() {
    const lines = relevant.map(c => {
      const label = c.reviewedClassLabel || c.classLabel
      return JSON.stringify({
        image_url:   c.scannedImageUrl || c.scannedImagePath,
        vegetable:   vegFromLabel(label).replace(' ', '_'),
        label_txt:   captureToYoloLines(c, classMap),
        class_label: label,
        is_fresh:    freshFromLabel(label),
        reviewed_at: c.reviewedAt,
        source_id:   c.id,
      })
    }).join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([lines], { type: 'application/jsonl' })),
      download: 'approved_captures.jsonl',
    })
    a.click()
  }

  function downloadDataYaml() {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([dataYaml], { type: 'text/yaml' })),
      download: 'data.yaml',
    })
    a.click()
  }

  const vegList = Object.keys(groups).sort()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{relevant.length} approved captures · ready for training</p>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
            Close
          </button>
        </div>

        <div className="p-6 space-y-5">
          {relevant.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">
              No approved captures match this release's vegetables yet.
              <br />Approve images in Dataset Retrieval first.
            </p>
          ) : (
            <>
              {/* Per-vegetable summary bars */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {vegList.map(veg => {
                  const g = groups[veg]
                  return (
                    <div key={veg} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <p className="font-semibold text-sm text-slate-800">{veg}</p>
                      <div className="mt-1.5 flex gap-3 text-xs">
                        <span className="text-emerald-700 font-medium">{g.fresh} fresh</span>
                        <span className="text-rose-600 font-medium">{g.rotten} rotten</span>
                        <span className="text-slate-400">{g.total} total</span>
                      </div>
                      <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className="bg-emerald-500" style={{ width: `${(g.fresh/g.total*100).toFixed(0)}%` }} />
                        <div className="bg-rose-400"    style={{ width: `${(g.rotten/g.total*100).toFixed(0)}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tab bar */}
              <div className="flex gap-2 border-b border-slate-100">
                {[['tree','YOLO Folder Tree'],['yaml','data.yaml']].map(([tab, label]) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-cyan-500 text-cyan-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* YOLO folder tree (interactive) */}
              {activeTab === 'tree' && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs text-slate-600 space-y-0.5">
                  {/* Root */}
                  <p>📁 dataset/</p>
                  <p className="pl-4 text-yellow-600">📄 data.yaml</p>

                  {['images','labels'].map(type => (
                    <div key={type}>
                      {['train','val'].map(split => (
                        <div key={split}>
                          <p className="pl-4 text-blue-500">📁 {type}/{split}/</p>
                          {vegList.map(veg => {
                            const nodeKey = `${type}/${split}/${veg}`
                            const isOpen  = expandedNodes[nodeKey]
                            const count   = split === 'train'
                              ? Math.round(groups[veg].total * 0.8)
                              : Math.round(groups[veg].total * 0.2)
                            // only show captures for the images/ type (labels are derived)
                            const vegCaptures = capturesByVeg[veg] ?? []
                            const slicedCaps  = split === 'train'
                              ? vegCaptures.slice(0, Math.round(vegCaptures.length * 0.8))
                              : vegCaptures.slice(Math.round(vegCaptures.length * 0.8))

                            return (
                              <div key={veg}>
                                {/* Clickable folder row */}
                                <button
                                  type="button"
                                  onClick={() => toggleNode(nodeKey)}
                                  className="pl-8 flex items-center gap-1.5 w-full text-left hover:text-slate-900 transition-colors py-0.5 group"
                                >
                                  <span className="text-[10px] text-slate-300 group-hover:text-slate-400 transition-colors">
                                    {isOpen ? '▾' : '▸'}
                                  </span>
                                  <span className="text-slate-500">📁 {veg.replace(' ','_')}/</span>
                                  <span className="ml-1 text-cyan-600">
                                    {count} {type === 'labels' ? '.txt' : 'imgs'}
                                  </span>
                                </button>

                                {/* Expanded: show thumbnails (images only) or label lines (labels) */}
                                {isOpen && (
                                  <div className="pl-14 mt-1 mb-2">
                                    {type === 'images' ? (
                                      <div className="flex flex-wrap gap-2">
                                        {slicedCaps.slice(0, 12).map((cap, idx) => {
                                          const imgUrl = cap.scannedImageUrl || cap.scannedImagePath
                                          const label  = cap.reviewedClassLabel || cap.classLabel
                                          const fresh  = freshFromLabel(label)
                                          const rawDets = parseJson(cap.reviewedDetections) || parseJson(cap.detections)
                                          const overlayBoxes = (Array.isArray(rawDets) && rawDets.length > 0)
                                            ? rawDets
                                            : (cap.boxRight != null ? [{
                                                classLabel: label,
                                                boxLeft: cap.boxLeft, boxTop: cap.boxTop,
                                                boxRight: cap.boxRight, boxBottom: cap.boxBottom,
                                              }] : [])
                                          return (
                                            <div key={cap.id} className="relative group/img w-14 h-14">
                                              {imgUrl ? (
                                                <img
                                                  src={imgUrl}
                                                  alt={label}
                                                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 bg-slate-100"
                                                />
                                              ) : (
                                                <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-200 flex items-center justify-center text-slate-400 text-[9px] text-center leading-tight px-1">
                                                  no img
                                                </div>
                                              )}
                                              {imgUrl && overlayBoxes.length > 0 && (
                                                <svg
                                                  viewBox="0 0 1 1"
                                                  preserveAspectRatio="none"
                                                  className="pointer-events-none absolute inset-0 w-full h-full rounded-lg"
                                                >
                                                  {overlayBoxes.map((d, i) => {
                                                    if (d.boxRight == null || (d.boxRight - d.boxLeft) <= 0.01) return null
                                                    const isF = freshFromLabel(d.classLabel)
                                                    return (
                                                      <rect
                                                        key={i}
                                                        x={d.boxLeft}
                                                        y={d.boxTop}
                                                        width={d.boxRight - d.boxLeft}
                                                        height={d.boxBottom - d.boxTop}
                                                        fill="none"
                                                        stroke={isF ? '#10b981' : '#ef4444'}
                                                        strokeWidth={0.025}
                                                        vectorEffect="non-scaling-stroke"
                                                      />
                                                    )
                                                  })}
                                                </svg>
                                              )}
                                              <span className={`absolute bottom-0.5 right-0.5 text-[8px] font-bold px-1 rounded ${fresh ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                {fresh ? 'F' : 'R'}
                                              </span>
                                            </div>
                                          )
                                        })}
                                        {slicedCaps.length > 12 && (
                                          <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                                            +{slicedCaps.length - 12}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      /* labels: show a sample .txt line */
                                      slicedCaps.slice(0, 3).map((cap, _idx) => {
                                        const line = captureToYoloLines(cap, classMap)
                                        return (
                                          <p key={cap.id} className="text-[10px] text-slate-400 truncate font-mono">
                                            img_{String(_idx+1).padStart(3,'0')}.txt: {line || '—'}
                                          </p>
                                        )
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* data.yaml preview */}
              {activeTab === 'yaml' && (
                <pre className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-900 px-5 py-4 text-[11px] text-emerald-300 leading-relaxed">
                  {dataYaml}
                </pre>
              )}

              {/* Downloads */}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={downloadManifest}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
                  Download approved_captures.jsonl
                </button>
                <button type="button" onClick={downloadDataYaml}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Download data.yaml
                </button>
              </div>

              <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700 leading-relaxed">
                <strong>How to retrain:</strong> Download the JSONL, fetch each <code className="font-mono mx-0.5">image_url</code>,
                save each <code className="font-mono mx-0.5">label_txt</code> as a <code className="font-mono mx-0.5">.txt</code> file
                alongside the image, then point YOLOv8 at <code className="font-mono mx-0.5">data.yaml</code>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ release, action, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold capitalize text-slate-900">{action} release</h2>
        <p className="mt-2 text-sm text-slate-600">
          {action === 'publish'  && `Publish "${release.name}"? It will appear on the public landing page with a download link.`}
          {action === 'archive'  && `Archive "${release.name}"? It stays in Supabase but hides from the landing page.`}
          {action === 'delete'   && `Permanently delete "${release.name}"? This cannot be undone.`}
          {action === 'review'   && `Move "${release.name}" to review stage?`}
          {action === 'unpublish'&& `Unpublish "${release.name}"? It will be hidden from the landing page.`}
          {action === 'reject'   && `Reject "${release.name}"? It will go back to Draft so the owner can fix it and resubmit.`}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={onConfirm}
            className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
              action === 'delete' ? 'bg-rose-600 hover:bg-rose-700'
              : action === 'publish' ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-slate-800 hover:bg-slate-900'}`}>
            Yes, {action}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Release Card ──────────────────────────────────────────────────────────────
function ReleaseCard({ release, approvedCount, onAction, onViewPool }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{release.id?.slice(0,8)}…</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusPill(release.status)}`}>
              {release.status}
            </span>
            <span className="text-xs font-semibold text-slate-600">v{release.version}</span>
          </div>
          <p className="mt-1.5 text-base font-semibold text-slate-900">{release.name}</p>
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{release.changelog}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
            {release.sample_count > 0 && <span>{release.sample_count.toLocaleString()} samples</span>}
            {release.fresh_ratio > 0   && <span>{(release.fresh_ratio*100).toFixed(0)}% fresh</span>}
            <span>Vegetables: {release.vegetables?.join(', ') || '—'}</span>
            <span className="text-cyan-600 font-medium">{approvedCount} in approved pool</span>
            <span>Updated {new Date(release.updated_at).toLocaleDateString()}</span>
          </div>
          {release.public_url && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="max-w-full truncate rounded-md bg-slate-900/90 px-2 py-1 text-[11px] text-emerald-200">
                {release.public_url}
              </code>
              <button type="button" onClick={() => navigator.clipboard?.writeText(release.public_url)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 shrink-0">
          {/* View Pool opens the popup */}
          <button type="button" onClick={onViewPool}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
            View pool
          </button>
          {release.status === 'Draft' && (
            <button type="button" onClick={() => onAction('review')}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700">
              Send to review
            </button>
          )}
          {(release.status === 'Draft' || release.status === 'Review') && (
            <button type="button" onClick={() => onAction('publish')}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
              {release.status === 'Review' ? 'Approve & publish' : 'Publish'}
            </button>
          )}
          {release.status === 'Review' && (
            <button type="button" onClick={() => onAction('reject')}
              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">
              Reject (back to draft)
            </button>
          )}
          {release.status === 'Published' && (
            <button type="button" onClick={() => onAction('unpublish')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
              Unpublish
            </button>
          )}
          <button type="button" onClick={() => onAction('delete')}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ['Draft', 'Review', 'Published', 'Archived', 'All']

export default function DatasetReleasePage() {
  const [releases, setReleases]           = useState([])
  const [loadingReleases, setLoadingRel]  = useState(true)
  const [approvedCaptures, setApproved]   = useState([])
  const [loadingPool, setLoadingPool]     = useState(true)

  const [search, setSearch]               = useState('')
  const [statusFilter, setStatusFilter]   = useState('Draft')

  const [confirm, setConfirm]             = useState(null)   // { release, action }
  const [poolPopup, setPoolPopup]         = useState(null)   // { title, vegetables }
  const [toast, setToast]                 = useState('')
  const [autoCreating, setAutoCreating]   = useState(false)

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 4000) }

  // ── Load releases from Supabase ──
  async function loadReleases() {
    setLoadingRel(true)
    const { data, error } = await supabase
      .from('dataset_releases')
      .select('*')
      .order('updated_at', { ascending: false })
    if (!error) setReleases(data ?? [])
    setLoadingRel(false)
  }

  // ── Load approved captures pool ──
  async function loadPool() {
    setLoadingPool(true)
    const { data } = await supabase
      .from('scan_history')
      .select(
        'id, class_label, is_fresh, scanned_image_path, detections,' +
        'box_left, box_top, box_right, box_bottom,' +
        'reviewed_class_label, reviewed_detections,' +
        'reviewed_box_left, reviewed_box_top, reviewed_box_right, reviewed_box_bottom, reviewed_at'
      )
      .eq('review_status', 'approved')
      .order('reviewed_at', { ascending: false })
    setApproved((data ?? []).map(r => ({
      id:                  r.id,
      classLabel:          r.class_label ?? '',
      scannedImageUrl:     r.scanned_image_path?.startsWith('http') ? r.scanned_image_path : null,
      scannedImagePath:    r.scanned_image_path ?? '',
      boxLeft:             r.box_left, boxTop:  r.box_top,
      boxRight:            r.box_right, boxBottom: r.box_bottom,
      detections:          parseJson(r.detections),
      reviewedClassLabel:  r.reviewed_class_label,
      reviewedDetections:  parseJson(r.reviewed_detections),
      reviewedBoxLeft:     r.reviewed_box_left, reviewedBoxTop:    r.reviewed_box_top,
      reviewedBoxRight:    r.reviewed_box_right, reviewedBoxBottom: r.reviewed_box_bottom,
      reviewedAt:          r.reviewed_at,
    })))
    setLoadingPool(false)
  }

  useEffect(() => { loadReleases(); loadPool() }, [])

  // ── Approved pool count for a specific release's vegetables ──
  function approvedCountFor(vegetables) {
    if (!vegetables?.length) return approvedCaptures.length
    return approvedCaptures.filter(c => {
      const veg = vegFromLabel(c.reviewedClassLabel || c.classLabel)
      return vegetables.includes(veg)
    }).length
  }

  // ── Auto-create one draft per vegetable that has pool captures but no Draft yet ──
  async function autoCreateDrafts() {
    if (autoCreating || loadingPool) return
    setAutoCreating(true)
    const groups = groupCaptures(approvedCaptures)
    const vegsInPool = Object.keys(groups)
    if (!vegsInPool.length) { showToast('No approved captures in pool yet.'); setAutoCreating(false); return }

    // Re-fetch so we don't rely on possibly-stale local state after the user
    // deletes drafts directly in the DB.
    const { data: freshReleases, error: fetchErr } = await supabase
      .from('dataset_releases')
      .select('*')
      .order('updated_at', { ascending: false })
    if (fetchErr) {
      showToast(`Failed to load releases: ${fetchErr.message}`)
      setAutoCreating(false)
      return
    }
    setReleases(freshReleases ?? [])
    const currentReleases = freshReleases ?? []

    let created = 0
    let skipped = 0
    let failed = 0
    let lastError = null
    for (const veg of vegsInPool) {
      // Check if a Draft already exists for this vegetable
      const existingDraft = currentReleases.find(r =>
        (r.status === 'Draft' || r.status === 'Review') &&
        r.vegetables?.includes(veg)
      )
      if (existingDraft) { skipped++; continue } // already has a draft, skip

      // Find highest published version for this vegetable to bump from
      const publishedVersions = releases
        .filter(r => r.status === 'Published' && r.vegetables?.includes(veg))
        .map(r => parseFloat(r.version) || 0)
      const nextVer = publishedVersions.length
        ? (Math.max(...publishedVersions) + 1).toFixed(1)
        : '1.0'

      const { data, error } = await supabase
        .from('dataset_releases')
        .insert({
          name:         `FreshLens ${veg} v${nextVer}`,
          version:      nextVer,
          vegetables:   [veg],
          changelog:    `Auto-created draft from ${groups[veg].total} approved ${veg} captures.`,
          sample_count: groups[veg].total,
          fresh_ratio:  groups[veg].total > 0 ? groups[veg].fresh / groups[veg].total : 0,
          status:       'Draft',
          public_url:   '',
        })
        .select()
        .single()
      if (!error && data) {
        setReleases(prev => [data, ...prev])
        created++
      } else if (error) {
        failed++
        lastError = error
        console.error('[autoCreateDrafts] insert failed for', veg, error)
      }
    }
    if (created > 0) {
      showToast(`${created} draft(s) created. Review and publish when ready.`)
    } else if (failed > 0) {
      showToast(`Failed to create drafts: ${lastError?.message ?? 'unknown error'}`)
    } else {
      showToast(`All ${skipped} vegetable(s) already have a draft.`)
    }
    setAutoCreating(false)
  }

  // ── Run a lifecycle action on a release ──
  async function runAction(release, action) {
    const updates = { updated_at: new Date().toISOString() }
    if (action === 'review')    updates.status = 'Review'
    if (action === 'reject')    updates.status = 'Draft'
    if (action === 'publish') {
      updates.status     = 'Published'
      updates.public_url = `https://${import.meta.env.VITE_SUPABASE_URL?.match(/([^/]+\.supabase\.co)/)?.[1] ?? '<project>.supabase.co'}/storage/v1/object/public/datasets/${release.id}.zip`
      updates.sample_count = approvedCountFor(release.vegetables)
    }
    if (action === 'unpublish') { updates.status = 'Draft'; updates.public_url = '' }
    if (action === 'archive')   updates.status = 'Archived'
    if (action === 'delete') {
      const { error } = await supabase.from('dataset_releases').delete().eq('id', release.id)
      if (error) { showToast('Delete failed: ' + error.message); return }
      setReleases(prev => prev.filter(r => r.id !== release.id))
      showToast(`Deleted ${release.name}.`)
      return
    }
    const { data, error } = await supabase
      .from('dataset_releases').update(updates).eq('id', release.id).select().single()
    if (error) { showToast('Update failed: ' + error.message); return }
    setReleases(prev => prev.map(r => r.id === release.id ? data : r))
    showToast(`${release.name} → ${data.status}.`)
  }

  // ── Stats ──
  const stats = useMemo(() => ({
    published:    releases.filter(r => r.status === 'Published').length,
    drafts:       releases.filter(r => r.status === 'Draft' || r.status === 'Review').length,
    approvedPool: approvedCaptures.length,
    totalSamples: releases.reduce((s, r) => s + (r.sample_count ?? 0), 0),
  }), [releases, approvedCaptures])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return releases.filter(r => {
      const txt = !q || r.name.toLowerCase().includes(q) || r.version?.includes(q)
        || r.vegetables?.join(' ').toLowerCase().includes(q)
      const st  = statusFilter === 'All' || r.status === statusFilter
      return txt && st
    })
  }, [releases, search, statusFilter])

  return (
    <>
      <section className="space-y-5">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">

          {/* Header */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dataset release</h1>
              <p className="mt-1 text-sm text-slate-500">
                Bundle approved captures into versioned releases. Published releases appear on the landing page as public downloads.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button"
                onClick={autoCreateDrafts}
                disabled={autoCreating || loadingPool || approvedCaptures.length === 0}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                {autoCreating ? 'Creating…' : 'Auto-create from pool'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Published',       value: stats.published },
              { label: 'Drafts / review', value: stats.drafts },
              { label: 'Total samples',   value: stats.totalSamples.toLocaleString() },
              { label: 'Approved pool',   value: loadingPool ? '…' : approvedCaptures.length },
            ].map(c => (
              <div key={c.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</p>
              </div>
            ))}
          </div>

          {/* "View full pool" button — opens the popup for all vegetables */}
          <div className="mb-5">
            <button type="button"
              onClick={() => setPoolPopup({ title: 'Full approved pool — all vegetables', vegetables: [] })}
              disabled={loadingPool || approvedCaptures.length === 0}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 disabled:opacity-50">
              View full approved pool ({loadingPool ? '…' : approvedCaptures.length} captures) →
            </button>
            <p className="mt-1.5 text-xs text-slate-400">
              All approved images across every vegetable. Used when building a release.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, version, vegetable…"
              className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400">
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Release list */}
          {loadingReleases
            ? <p className="py-8 text-center text-sm text-slate-400">Loading releases…</p>
            : (
              <div className="space-y-3">
                {filtered.map(r => (
                  <ReleaseCard key={r.id} release={r}
                    approvedCount={approvedCountFor(r.vegetables)}
                    onAction={action => setConfirm({ release: r, action })}
                    onViewPool={() => setPoolPopup({
                      title: `${r.name} — approved pool`,
                      vegetables: r.vegetables ?? [],
                    })} />
                ))}
                {filtered.length === 0 && (
                  <p className="pt-6 text-center text-sm text-slate-500">
                    {releases.length === 0
                      ? 'No releases yet. Create one to get started.'
                      : 'No releases match the filter.'}
                  </p>
                )}
              </div>
            )
          }

          {toast && (
            <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-medium text-emerald-700">{toast}</p>
          )}
        </div>
      </section>

      {/* Modals */}
      {confirm && (
        <ConfirmModal release={confirm.release} action={confirm.action}
          onClose={() => setConfirm(null)}
          onConfirm={() => { runAction(confirm.release, confirm.action); setConfirm(null) }} />
      )}

      {poolPopup && (
        <PoolPopup title={poolPopup.title} captures={approvedCaptures}
          vegetables={poolPopup.vegetables}
          onClose={() => setPoolPopup(null)} />
      )}
    </>
  )
}
