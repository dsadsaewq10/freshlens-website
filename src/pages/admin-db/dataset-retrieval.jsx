import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

// All 22 YOLO class labels — must match model_service.dart labels[]
const CLASS_LABELS = [
  'Fresh_Cabbage', 'Fresh_Carrot', 'Fresh_Cucumber', 'Fresh_Pepper',
  'Fresh_Potato', 'Fresh_Tomato', 'Rotten_Cabbage', 'Rotten_Carrot',
  'Rotten_Cucumber', 'Rotten_Pepper', 'Rotten_Potato', 'Rotten_Tomato',
  'Fresh_Garlic', 'Rotten_Garlic', 'Fresh_Broccoli', 'Rotten_Broccoli',
  'Fresh_Eggplant', 'Rotten_Eggplant', 'Fresh_NapaCabbage', 'Rotten_NapaCabbage',
  'Fresh_Onion', 'Rotten_Onion',
]
const VEGETABLE_OPTIONS = ['All', ...new Set(CLASS_LABELS.map((l) => l.split('_').slice(1).join(' ')))]
const FRESHNESS_OPTIONS = ['All', 'Fresh', 'Rotten']
const REVIEW_OPTIONS    = ['All', 'pending', 'approved', 'rejected']
const LABEL_COLORS = ['#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6','#f97316','#ec4899','#14b8a6']

function reviewPill(s) {
  if (s === 'approved') return 'bg-emerald-100 text-emerald-700'
  if (s === 'pending')  return 'bg-amber-100 text-amber-700'
  return 'bg-rose-100 text-rose-700'
}
function confColor(v) {
  if (v >= 0.85) return 'text-emerald-700'
  if (v >= 0.70) return 'text-amber-600'
  return 'text-rose-600'
}

// ─── Multi-BBox Canvas ───────────────────────────────────────────────────────
// boxes = [{ id, classLabel, left, top, right, bottom }]
// onBoxesChange(newBoxes) fired after every interaction
function MultiBBoxCanvas({ imageUrl, boxes, onBoxesChange, readOnly = false }) {
  const canvasRef  = useRef(null)
  const imgRef     = useRef(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [localBoxes, setLocalBoxes] = useState(boxes)
  const localBoxesRef = useRef(boxes)
  const drag = useRef({ active: false, type: null, boxId: null, handle: null, startX: 0, startY: 0, orig: null })

  useEffect(() => { setLocalBoxes(boxes); localBoxesRef.current = boxes }, [boxes])

  const H = 10 // handle half-size px

  function colorFor(idx) { return LABEL_COLORS[idx % LABEL_COLORS.length] }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || !imgLoaded) return
    const ctx = canvas.getContext('2d')
    const { width: W, height: H2 } = canvas
    ctx.clearRect(0, 0, W, H2)
    localBoxes.forEach((b, idx) => {
      const x  = b.left  * W, y  = b.top    * H2
      const bw = (b.right - b.left) * W
      const bh = (b.bottom - b.top) * H2
      const col = colorFor(idx)
      ctx.fillStyle   = col + '22'
      ctx.fillRect(x, y, bw, bh)
      ctx.strokeStyle = col
      ctx.lineWidth   = 2
      ctx.strokeRect(x, y, bw, bh)
      // Label chip
      ctx.fillStyle = col
      ctx.font = 'bold 11px sans-serif'
      const chip = b.classLabel.replace('_', ' ')
      const tw = ctx.measureText(chip).width
      ctx.fillRect(x, y - 16, tw + 8, 16)
      ctx.fillStyle = '#fff'
      ctx.fillText(chip, x + 4, y - 4)
      if (!readOnly) {
        // Resize handles at corners
        [[x,y],[x+bw,y],[x,y+bh],[x+bw,y+bh]].forEach(([hx,hy]) => {
          ctx.fillStyle   = '#fff'
          ctx.strokeStyle = col
          ctx.lineWidth   = 1.5
          ctx.fillRect(hx-H, hy-H, H*2, H*2)
          ctx.strokeRect(hx-H, hy-H, H*2, H*2)
        })
      }
    })
  }

  useEffect(() => { draw() })

  function onImgLoad() {
    const c = canvasRef.current, i = imgRef.current
    if (!c || !i) return
    c.width  = i.naturalWidth  || i.width
    c.height = i.naturalHeight || i.height
    setImgLoaded(true)
  }

  function relPos(e) {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const sx = c.width / r.width, sy = c.height / r.height
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy2 = e.touches ? e.touches[0].clientY : e.clientY
    return { x: (cx - r.left)*sx, y: (cy2 - r.top)*sy }
  }

  function hitHandle(px, py, b, W, H2) {
    const x=b.left*W,y=b.top*H2,bw=(b.right-b.left)*W,bh=(b.bottom-b.top)*H2
    const corners=[['tl',x,y],['tr',x+bw,y],['bl',x,y+bh],['br',x+bw,y+bh]]
    for (const [n,hx,hy] of corners) {
      if (Math.abs(px-hx)<=H && Math.abs(py-hy)<=H) return n
    }
    return null
  }

  function hitBox(px, py, b, W, H2) {
    return px>=b.left*W && px<=b.right*W && py>=b.top*H2 && py<=b.bottom*H2
  }

  function onDown(e) {
    if (readOnly) return
    e.preventDefault()
    const c = canvasRef.current
    const { x, y } = relPos(e)
    const d = drag.current
    d.startX = x; d.startY = y
    for (const b of [...localBoxes].reverse()) {
      const handle = hitHandle(x, y, b, c.width, c.height)
      if (handle) { d.active=true; d.type='resize'; d.boxId=b.id; d.handle=handle; d.orig={...b}; return }
      if (hitBox(x, y, b, c.width, c.height)) { d.active=true; d.type='move'; d.boxId=b.id; d.orig={...b}; return }
    }
  }

  function onMove(e) {
    if (readOnly || !drag.current.active) return
    e.preventDefault()
    const c = canvasRef.current
    const { x, y } = relPos(e)
    const d = drag.current
    const dx = (x-d.startX)/c.width, dy = (y-d.startY)/c.height
    const next = localBoxesRef.current.map(b => {
      if (b.id !== d.boxId) return b
      let nb = { ...d.orig }
      if (d.type === 'move') {
        const bw=nb.right-nb.left, bh=nb.bottom-nb.top
        nb.left   = Math.max(0, Math.min(1-bw, nb.left+dx))
        nb.top    = Math.max(0, Math.min(1-bh, nb.top+dy))
        nb.right  = nb.left+bw; nb.bottom=nb.top+bh
      } else {
        const h = d.handle
        if (h==='tl'){ nb.left=Math.max(0,Math.min(nb.right-0.05,nb.left+dx)); nb.top=Math.max(0,Math.min(nb.bottom-0.05,nb.top+dy)) }
        if (h==='tr'){ nb.right=Math.min(1,Math.max(nb.left+0.05,nb.right+dx)); nb.top=Math.max(0,Math.min(nb.bottom-0.05,nb.top+dy)) }
        if (h==='bl'){ nb.left=Math.max(0,Math.min(nb.right-0.05,nb.left+dx)); nb.bottom=Math.min(1,Math.max(nb.top+0.05,nb.bottom+dy)) }
        if (h==='br'){ nb.right=Math.min(1,Math.max(nb.left+0.05,nb.right+dx)); nb.bottom=Math.min(1,Math.max(nb.top+0.05,nb.bottom+dy)) }
      }
      return nb
    })
    localBoxesRef.current = next
    setLocalBoxes(next)
  }

  function onUp() {
    if (drag.current.active && onBoxesChange) onBoxesChange(localBoxesRef.current)
    drag.current.active = false
  }

  return (
    <div className="relative select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <img ref={imgRef} src={imageUrl} alt="scan" onLoad={onImgLoad}
        className="block w-full rounded-xl" crossOrigin="anonymous" />
      <canvas ref={canvasRef}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        className="absolute inset-0 h-full w-full"
        style={{ cursor: readOnly ? 'default' : 'crosshair' }} />
    </div>
  )
}

// ─── Review Modal ────────────────────────────────────────────────────────────
let _nextBoxId = 1
function newBoxId() { return `box-${_nextBoxId++}` }

function rawDetectionsToBoxes(detections, fallback) {
  if (detections && detections.length > 0) {
    return detections.map((d) => ({
      id: newBoxId(),
      classLabel: d.classLabel ?? CLASS_LABELS[0],
      left:   d.boxLeft   ?? 0.1,
      top:    d.boxTop    ?? 0.1,
      right:  d.boxRight  ?? 0.9,
      bottom: d.boxBottom ?? 0.9,
    }))
  }
  // Fall back to single primary bbox
  return [{
    id: newBoxId(),
    classLabel: fallback.classLabel ?? CLASS_LABELS[0],
    left:   fallback.boxLeft   ?? 0.1,
    top:    fallback.boxTop    ?? 0.1,
    right:  fallback.boxRight  ?? 0.9,
    bottom: fallback.boxBottom ?? 0.9,
  }]
}

function ReviewModal({ capture, onClose, onSave }) {
  // If this capture was already reviewed, reopen with the reviewed boxes so
  // previously-added/moved boxes persist across review sessions.
  const [boxes, setBoxes] = useState(() =>
    capture.reviewedDetections?.length > 0
      ? rawDetectionsToBoxes(capture.reviewedDetections, capture)
      : rawDetectionsToBoxes(capture.detections, capture)
  )
  const [notes, setNotes]   = useState(capture.reviewNotes || '')
  const [saving, setSaving] = useState(false)

  const imageUrl = capture.scannedImageUrl || capture.scannedImagePath

  function addBox() {
    setBoxes(prev => [...prev, {
      id: newBoxId(), classLabel: CLASS_LABELS[0],
      left: 0.2, top: 0.2, right: 0.8, bottom: 0.8,
    }])
  }

  function removeBox(id) {
    if (boxes.length <= 1) return          // keep at least one
    setBoxes(prev => prev.filter(b => b.id !== id))
  }

  function setBoxLabel(id, label) {
    setBoxes(prev => prev.map(b => b.id === id ? { ...b, classLabel: label } : b))
  }

  async function submit(status) {
    setSaving(true)
    // Convert boxes back to the detections format for Supabase
    const reviewedDetections = boxes.map(b => ({
      classLabel: b.classLabel,
      boxLeft: b.left, boxTop: b.top,
      boxRight: b.right, boxBottom: b.bottom,
    }))
    await onSave({
      id: capture.id,
      supabaseId: capture.supabaseId,
      reviewStatus: status,
      reviewedDetections,
      // Primary = highest-confidence box (first)
      reviewedClassLabel: boxes[0].classLabel,
      reviewedBoxLeft:   boxes[0].left,
      reviewedBoxTop:    boxes[0].top,
      reviewedBoxRight:  boxes[0].right,
      reviewedBoxBottom: boxes[0].bottom,
      reviewNotes: notes,
      reviewedAt: new Date().toISOString(),
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm overflow-y-auto">
      <div className="flex w-full max-w-4xl flex-col gap-5 rounded-3xl bg-white p-6 shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Review annotation</h2>
            <p className="mt-0.5 text-[11px] text-slate-400 font-mono">{capture.id}</p>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Left — image canvas */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Bounding boxes — drag to move · corners to resize
            </p>
            {imageUrl
              ? <MultiBBoxCanvas imageUrl={imageUrl} boxes={boxes} onBoxesChange={setBoxes} />
              : <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">No image</div>
            }
            <button type="button" onClick={addBox}
              className="w-full rounded-xl border border-dashed border-cyan-300 py-2 text-xs font-semibold text-cyan-600 hover:bg-cyan-50">
              + Add bounding box
            </button>
          </div>

          {/* Right — box list + controls */}
          <div className="flex flex-col gap-3">
            {/* Original info */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-700 text-sm">Original prediction</p>
              <p>Class: <span className="font-mono">{capture.classLabel}</span></p>
              <p>Confidence: <span className={`font-semibold ${confColor(capture.confidence)}`}>{(capture.confidence*100).toFixed(1)}%</span></p>
              <p>Detections: {capture.detections?.length ?? 1} object{(capture.detections?.length ?? 1) !== 1 ? 's' : ''}</p>
              <p>Scanned: {capture.scannedAt ? new Date(capture.scannedAt).toLocaleString() : '—'}</p>
            </div>

            {/* Per-box label list */}
            <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Annotations ({boxes.length})
              </p>
              {boxes.map((b, idx) => (
                <div key={b.id} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: LABEL_COLORS[idx % LABEL_COLORS.length] }} />
                  <select value={b.classLabel} onChange={e => setBoxLabel(b.id, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-cyan-400">
                    {CLASS_LABELS.map(l => <option key={l} value={l}>{l.replace('_', ' — ')}</option>)}
                  </select>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {((b.right-b.left)*100).toFixed(0)}×{((b.bottom-b.top)*100).toFixed(0)}%
                  </span>
                  <button type="button" onClick={() => removeBox(b.id)}
                    disabled={boxes.length <= 1}
                    className="text-rose-400 hover:text-rose-600 disabled:opacity-30 text-xs font-bold">✕</button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                placeholder="e.g. bbox adjusted, label corrected…"
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-cyan-400" />
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2 pt-1">
              <button type="button" disabled={saving} onClick={() => submit('approved')}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {saving ? 'Saving…' : `Approve (${boxes.length} box${boxes.length !== 1 ? 'es' : ''})`}
              </button>
              <button type="button" disabled={saving} onClick={() => submit('rejected')}
                className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Capture Card ─────────────────────────────────────────────────────────────
function CaptureCard({ capture, isSelected, onToggle, onReview }) {
  const imageUrl = capture.scannedImageUrl || capture.scannedImagePath
  // Prefer reviewed detections so the count reflects boxes added/removed in review.
  const detCount = capture.reviewedDetections?.length
    || capture.detections?.length
    || (capture.boxRight != null && (capture.boxRight - capture.boxLeft) > 0.01 ? 1 : 0)

  // Build SVG boxes for thumbnail overlay.
  // Prefer reviewed detections so approved edits (added/moved boxes) show up.
  const svgBoxes = useMemo(() => {
    const reviewed = capture.reviewedDetections
    if (reviewed?.length > 0) {
      return reviewed.map((d, i) => ({
        left: d.boxLeft, top: d.boxTop,
        w: d.boxRight - d.boxLeft, h: d.boxBottom - d.boxTop,
        color: LABEL_COLORS[i % LABEL_COLORS.length],
      }))
    }
    if (capture.detections?.length > 0) {
      return capture.detections.map((d, i) => ({
        left: d.boxLeft, top: d.boxTop,
        w: d.boxRight - d.boxLeft, h: d.boxBottom - d.boxTop,
        color: LABEL_COLORS[i % LABEL_COLORS.length],
      }))
    }
    if (capture.boxLeft != null && (capture.boxRight - capture.boxLeft) > 0.01) {
      return [{ left: capture.boxLeft, top: capture.boxTop,
        w: capture.boxRight - capture.boxLeft, h: capture.boxBottom - capture.boxTop,
        color: LABEL_COLORS[0] }]
    }
    return []
  }, [capture])

  return (
    <article className={`rounded-2xl border p-3 transition ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <label className="flex items-center gap-2 text-[11px] font-mono text-slate-500 cursor-pointer">
          <input type="checkbox" checked={isSelected} onChange={onToggle} />
          {capture.id.slice(0, 13)}…
        </label>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${reviewPill(capture.reviewStatus)}`}>
          {capture.reviewStatus}
        </span>
      </div>

      {/* Thumbnail */}
      {imageUrl ? (
        <div className="relative overflow-hidden rounded-xl">
          <img src={imageUrl} alt={capture.vegetableName} className="h-36 w-full object-cover rounded-xl" />
          {svgBoxes.length > 0 && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1 1" preserveAspectRatio="none">
              {svgBoxes.map((b, i) => (
                <rect key={i} x={b.left} y={b.top} width={b.w} height={b.h}
                  fill={b.color + '22'} stroke={b.color} strokeWidth="0.012" />
              ))}
            </svg>
          )}
        </div>
      ) : (
        <div className="flex h-36 w-full items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
          {(capture.vegetableName || '?').slice(0, 1)}
        </div>
      )}

      <div className="mt-3 space-y-1 text-xs text-slate-600">
        <p className="text-sm font-semibold text-slate-900">{capture.vegetableName} · {capture.isFresh ? 'Fresh' : 'Rotten'}</p>
        <p>YOLO: <span className="font-mono">{capture.classLabel}</span>{' '}
          <span className={`font-semibold ${confColor(capture.confidence)}`}>({(capture.confidence*100).toFixed(0)}%)</span>
        </p>
        {detCount > 1 && <p className="text-cyan-600 font-medium">{detCount} objects detected</p>}
        {capture.reviewedClassLabel && capture.reviewedClassLabel !== capture.classLabel && (
          <p className="text-emerald-700 font-medium">Corrected: {capture.reviewedClassLabel}</p>
        )}
        {svgBoxes.length === 0 && <p className="text-amber-600 text-[10px] font-medium">No bbox saved (old scan)</p>}
        <p className="text-slate-400">{capture.scannedAt ? new Date(capture.scannedAt).toLocaleDateString() : ''}</p>
      </div>

      <button type="button" onClick={onReview}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
        Review / Annotate
      </button>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function DatasetRetrievalPage() {
  const [captures, setCaptures]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [search, setSearch]           = useState('')
  const [vegFilter, setVegFilter]     = useState('All')
  const [freshFilter, setFreshFilter] = useState('All')
  const [revFilter, setRevFilter]     = useState('pending')
  const [bboxOnly, setBboxOnly]       = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [reviewTarget, setReviewTarget] = useState(null)
  const [toast, setToast]             = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 4000) }

  // ── Load ──
  useEffect(() => {
    async function load() {
      setLoading(true); setError(null)
      try {
        const { data, error: err } = await supabase
          .from('scan_history')
          .select(
            'id, user_id, vegetable_name, class_label, is_fresh, confidence,' +
            'scanned_image_path, scanned_at, detections,' +
            'box_left, box_top, box_right, box_bottom,' +
            'review_status, reviewed_class_label, reviewed_detections,' +
            'reviewed_box_left, reviewed_box_top, reviewed_box_right, reviewed_box_bottom,' +
            'review_notes, reviewed_at'
          )
          .order('scanned_at', { ascending: false })
          .limit(300)
        if (err) throw err
        setCaptures((data ?? []).map(row => ({
          id:                  row.id,
          supabaseId:          row.id,
          userId:              row.user_id,
          vegetableName:       row.vegetable_name ?? 'Unknown',
          classLabel:          row.class_label ?? '',
          isFresh:             row.is_fresh ?? false,
          confidence:          row.confidence ?? 0,
          scannedImageUrl:     row.scanned_image_path?.startsWith('http') ? row.scanned_image_path : null,
          scannedImagePath:    row.scanned_image_path ?? '',
          scannedAt:           row.scanned_at,
          detections:          parseJson(row.detections),
          boxLeft:             row.box_left,
          boxTop:              row.box_top,
          boxRight:            row.box_right,
          boxBottom:           row.box_bottom,
          reviewStatus:        row.review_status ?? 'pending',
          reviewedClassLabel:  row.reviewed_class_label,
          reviewedDetections:  parseJson(row.reviewed_detections),
          reviewedBoxLeft:     row.reviewed_box_left,
          reviewedBoxTop:      row.reviewed_box_top,
          reviewedBoxRight:    row.reviewed_box_right,
          reviewedBoxBottom:   row.reviewed_box_bottom,
          reviewNotes:         row.review_notes ?? '',
          reviewedAt:          row.reviewed_at,
        })))
      } catch (e) {
        setError(e.message ?? 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function parseJson(v) {
    if (!v) return null
    if (typeof v === 'object') return v
    try { return JSON.parse(v) } catch { return null }
  }

  // ── Save review ──
  const handleSaveReview = useCallback(async (decision) => {
    const { id, supabaseId, reviewStatus, reviewedDetections,
      reviewedClassLabel, reviewedBoxLeft, reviewedBoxTop,
      reviewedBoxRight, reviewedBoxBottom, reviewNotes, reviewedAt } = decision

    const { error: err } = await supabase
      .from('scan_history')
      .update({
        review_status:        reviewStatus,
        reviewed_detections:  reviewedDetections,
        reviewed_class_label: reviewedClassLabel,
        reviewed_box_left:    reviewedBoxLeft,
        reviewed_box_top:     reviewedBoxTop,
        reviewed_box_right:   reviewedBoxRight,
        reviewed_box_bottom:  reviewedBoxBottom,
        review_notes:         reviewNotes,
        reviewed_at:          reviewedAt,
      })
      .eq('id', supabaseId)

    if (err) { showToast('Save error: ' + err.message); return }

    setCaptures(prev => prev.map(c =>
      c.id === id ? { ...c, reviewStatus, reviewedDetections,
        reviewedClassLabel, reviewedBoxLeft, reviewedBoxTop,
        reviewedBoxRight, reviewedBoxBottom, reviewNotes, reviewedAt } : c
    ))
    showToast(`Capture ${reviewStatus}.`)
  }, [])

  // ── Bulk update ──
  async function bulkUpdate(status) {
    if (!selectedIds.size) return
    const ids = [...selectedIds]
    const { error: err } = await supabase
      .from('scan_history')
      .update({ review_status: status, reviewed_at: new Date().toISOString() })
      .in('id', ids)
    if (err) { showToast('Bulk error: ' + err.message); return }
    setCaptures(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, reviewStatus: status } : c))
    setSelectedIds(new Set())
    showToast(`Marked ${ids.length} as ${status}.`)
  }

  // ── Filters ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return captures.filter(c => {
      const txt = !q || c.id.includes(q) || (c.userId??'').toLowerCase().includes(q) ||
        c.vegetableName.toLowerCase().includes(q) || c.classLabel.toLowerCase().includes(q)
      const veg  = vegFilter==='All' || c.classLabel.toLowerCase().includes(vegFilter.toLowerCase().replace(' ','_'))
      const fr   = freshFilter==='All' || (freshFilter==='Fresh' ? c.isFresh : !c.isFresh)
      const rev  = revFilter==='All' || c.reviewStatus===revFilter
      const bbox = !bboxOnly || (c.detections?.length > 0) ||
        (c.boxLeft!=null && (c.boxRight-c.boxLeft)>0.01)
      return txt && veg && fr && rev && bbox
    })
  }, [captures, search, vegFilter, freshFilter, revFilter, bboxOnly])

  const stats = useMemo(() => ({
    total:    captures.length,
    pending:  captures.filter(c=>c.reviewStatus==='pending').length,
    approved: captures.filter(c=>c.reviewStatus==='approved').length,
    hasBbox:  captures.filter(c=>(c.detections?.length>0)||(c.boxLeft!=null&&(c.boxRight-c.boxLeft)>0.01)).length,
  }), [captures])

  function toggleSelect(id) {
    setSelectedIds(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">

        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dataset retrieval</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, correct bounding boxes and labels, then approve for the retraining pool.
              Approved captures flow automatically to Dataset Release.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!selectedIds.size} onClick={() => bulkUpdate('approved')}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
              Approve ({selectedIds.size})
            </button>
            <button type="button" disabled={!selectedIds.size} onClick={() => bulkUpdate('rejected')}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
              Reject ({selectedIds.size})
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total captures',    value: stats.total },
            { label: 'Pending review',    value: stats.pending },
            { label: 'Approved',          value: stats.approved },
            { label: 'With bounding box', value: stats.hasBbox },
          ].map(c => (
            <div key={c.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search id, user, vegetable…"
            className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto" />
          {[
            [vegFilter, setVegFilter, VEGETABLE_OPTIONS],
            [freshFilter, setFreshFilter, FRESHNESS_OPTIONS],
            [revFilter, setRevFilter, REVIEW_OPTIONS],
          ].map(([val, set, opts], i) => (
            <select key={i} value={val} onChange={e=>set(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400">
              {opts.map(o=><option key={o} value={o} className="capitalize">{o}</option>)}
            </select>
          ))}
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={bboxOnly} onChange={e=>setBboxOnly(e.target.checked)} />
            Has bbox
          </label>
        </div>

        {/* Selection bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <button type="button" onClick={() => setSelectedIds(new Set(filtered.map(c=>c.id)))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-100">
            Select all filtered ({filtered.length})
          </button>
          <button type="button" onClick={() => setSelectedIds(new Set())}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-100">
            Clear
          </button>
          {selectedIds.size > 0 && <span className="text-slate-400">{selectedIds.size} selected</span>}
        </div>

        {loading && <p className="py-8 text-center text-sm text-slate-400">Loading captures…</p>}

        {error && !loading && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 space-y-1">
            <p className="font-semibold">Failed to load</p>
            <p className="text-xs">{error}</p>
            <p className="text-xs text-slate-500">Run the SQL migration below first.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(c => (
              <CaptureCard key={c.id} capture={c}
                isSelected={selectedIds.has(c.id)}
                onToggle={() => toggleSelect(c.id)}
                onReview={() => setReviewTarget(c)} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full pt-8 text-center text-sm text-slate-500">No captures match filter.</p>
            )}
          </div>
        )}

        {toast && (
          <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-medium text-emerald-700">{toast}</p>
        )}

      </div>

      {reviewTarget && (
        <ReviewModal capture={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSave={handleSaveReview} />
      )}
    </section>
  )
}

export default DatasetRetrievalPage
