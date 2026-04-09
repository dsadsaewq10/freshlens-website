import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const periodOptions = ['1D', '7D', '30D']

const analyticsByPeriod = {
  '1D': {
    overviewTotal: 58,
    dau: 7.1,
    mau: 28.9,
    newUsers: 3.8,
    retention: [59, 34, 20],
    dauSeries: [7.1],
    mauSeries: [28.9],
    newUserSeries: [3.8],
    dailySeries: [68],
    freshness: { fresh: 74, notFresh: 26 },
    popularity: [62, 57, 46, 42, 36],
    confidence: [10, 15, 19, 28, 37, 33, 26, 18, 11, 7],
    downloads: [52, 41, 34, 22],
    consistency: 'Matched',
  },
  '7D': {
    overviewTotal: 64,
    dau: 8.2,
    mau: 31.5,
    newUsers: 12.4,
    retention: [62, 38, 24],
    dauSeries: [6.9, 7.2, 7.6, 7.4, 8.0, 8.1, 8.2],
    mauSeries: [30.1, 30.3, 30.6, 30.9, 31.0, 31.2, 31.5],
    newUserSeries: [4.2, 5.1, 6.3, 7.5, 8.9, 10.8, 12.4],
    dailySeries: [72, 84, 78, 95, 110, 104, 126],
    freshness: { fresh: 72, notFresh: 28 },
    popularity: [74, 68, 57, 52, 45],
    confidence: [12, 18, 22, 31, 44, 41, 35, 24, 18, 10],
    downloads: [58, 46, 39, 28],
    consistency: 'Matched',
  },
  '30D': {
    overviewTotal: 94,
    dau: 12.4,
    mau: 48.2,
    newUsers: 18.2,
    retention: [71, 44, 26],
    dauSeries: [9.4, 9.9, 10.5, 10.9, 11.2, 11.5, 11.8, 12.1, 12.3, 12.4],
    mauSeries: [41.0, 42.1, 43.6, 44.4, 45.2, 45.8, 46.5, 47.0, 47.8, 48.2],
    newUserSeries: [8.1, 9.0, 10.2, 11.3, 12.8, 13.6, 14.9, 16.1, 17.2, 18.2],
    dailySeries: [70, 88, 92, 102, 110, 120, 118, 126, 132, 128],
    freshness: { fresh: 68, notFresh: 32 },
    popularity: [92, 84, 73, 66, 58],
    confidence: [18, 24, 31, 40, 54, 46, 38, 29, 22, 14],
    downloads: [88, 72, 64, 48],
    consistency: 'Matched',
  },
}

const vegetableLabels = ['Tomato', 'Carrot', 'Cabbage', 'Pepper', 'Cucumber']

function buildCoordinates(values, width = 420, height = 180, padding = 16) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  return values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1 || 1)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return { x, y }
  })
}

function buildPolylinePoints(values, width = 420, height = 180, padding = 16) {
  return buildCoordinates(values, width, height, padding)
    .map((point) => `${point.x},${point.y}`)
    .join(' ')
}

function buildAreaPath(values, width = 420, height = 180, padding = 16) {
  const points = buildCoordinates(values, width, height, padding)
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const linePath = points.map((point) => `${point.x} ${point.y}`).join(' L ')
  return `M ${firstPoint.x} ${height - padding} L ${linePath} L ${lastPoint.x} ${height - padding} Z`
}

function InteractiveLineChart({ values, secondaryValues, areaValues, width = 420, height = 180 }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const mainPoints = useMemo(() => buildPolylinePoints(values, width, height), [values, width, height])
  const coords = useMemo(() => buildCoordinates(values, width, height), [values, width, height])
  const secondaryPoints = useMemo(
    () => (secondaryValues ? buildPolylinePoints(secondaryValues, width, height) : ''),
    [secondaryValues, width, height],
  )
  const areaPath = useMemo(
    () => (areaValues ? buildAreaPath(areaValues, width, height) : ''),
    [areaValues, width, height],
  )

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-32 w-full text-primary sm:h-36">
      {areaValues && <path d={areaPath} fill="currentColor" fillOpacity="0.12" />}
      {secondaryValues && (
        <polyline
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeDasharray="6 6"
          points={secondaryPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={mainPoints}
      />
      {coords.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={activeIndex === index ? 6 : 4}
          fill="currentColor"
          className="cursor-pointer"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex(index)}
          onBlur={() => setActiveIndex(null)}
          tabIndex={0}
        />
      ))}
      {activeIndex !== null && (
        <g transform={`translate(${coords[activeIndex].x - 24}, ${coords[activeIndex].y - 30})`}>
          <rect width="52" height="20" rx="6" fill="#1f2937" />
          <text x="26" y="14" textAnchor="middle" fontSize="10" fill="#ffffff">
            {values[activeIndex]}
          </text>
        </g>
      )}
    </svg>
  )
}

function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30D')
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [exportError, setExportError] = useState('')
  const dashboardPanelRef = useRef(null)
  const analytics = analyticsByPeriod[selectedPeriod]

  async function exportDashboardPdf() {
    if (!dashboardPanelRef.current || isExportingPdf) {
      return
    }

    setExportError('')
    setIsExportingPdf(true)

    try {
      const element = dashboardPanelRef.current
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      const canvas = await html2canvas(element, {
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        logging: false,
      })
      const imageData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageProperties = pdf.getImageProperties(imageData)
      const imageWidth = pageWidth
      const imageHeight = (imageProperties.height * imageWidth) / imageProperties.width

      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imageHeight
        pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`dashboard-${selectedPeriod}.pdf`)
    } catch (error) {
      console.error('Failed to export dashboard PDF', error)
      setExportError('Export failed. Please try again.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  const popularityBars = useMemo(() => {
    const max = Math.max(...analytics.popularity)
    return analytics.popularity.map((value, index) => ({
      label: vegetableLabels[index],
      height: `${(value / max) * 100}%`,
      value,
    }))
  }, [analytics.popularity])

  return (
    <section ref={dashboardPanelRef} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[rgba(226,232,240,0.8)] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Analytics dashboard</h2>
          <p className="mt-1 text-sm text-[rgb(100,116,139)]">Interactive visual analytics mapped to the test cases you provided</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportDashboardPdf}
            disabled={isExportingPdf}
            className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExportingPdf ? 'Exporting...' : 'Export PDF'}
          </button>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface p-1">
            {periodOptions.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  selectedPeriod === period ? 'bg-primary text-white' : 'text-accent hover:bg-[rgba(255,255,255,0.7)]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        {exportError && <p className="w-full text-xs font-medium text-[rgb(220,38,38)]">{exportError}</p>}
      </div>

      <div className="grid auto-rows-[minmax(220px,auto)] gap-4 sm:grid-cols-2 xl:grid-cols-12">
          <article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Analytics Overview</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.overviewTotal} total</p>
            <p className="mt-1 text-sm opacity-85">KPI cards show correct totals</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[68, 82, 74, 91].map((value, index) => (
                <div key={index} className="rounded-xl bg-[rgba(255,255,255,0.15)] p-2">
                  <div className="h-16 rounded-lg bg-[rgba(255,255,255,0.2)]">
                    <div className="rounded-lg bg-white" style={{ height: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">DAU / MAU Metrics</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.dau}k / {analytics.mau}k</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Daily and monthly active users</p>
            <InteractiveLineChart values={analytics.dauSeries} secondaryValues={analytics.mauSeries} />
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">New User Trend</p>
            <p className="mt-2 text-3xl font-semibold">+{analytics.newUsers}%</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Registration trend accuracy</p>
            <InteractiveLineChart values={analytics.newUserSeries} areaValues={analytics.newUserSeries} />
          </article>

          <article className="flex min-h-80 flex-col rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">User Retention</p>
            <p className="mt-2 text-3xl font-semibold">D1 {analytics.retention[0]}% · D7 {analytics.retention[1]}%</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Retention cohorts</p>
            <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
              <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90 sm:h-36 sm:w-36">
                {analytics.retention.map((value, index) => {
                  const radius = 40 - index * 7
                  const circumference = 2 * Math.PI * radius
                  const dash = `${(value / 100) * circumference} ${circumference}`
                  const strokeOpacity = index === 0 ? 1 : index === 1 ? 0.45 : 0.25
                  return (
                    <circle
                      key={index}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      className="text-primary"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={dash}
                      stroke="currentColor"
                      strokeOpacity={strokeOpacity}
                    />
                  )
                })}
              </svg>
              <div className="space-y-2 text-sm text-[rgba(50,52,62,0.75)]">
                <p>D1: {analytics.retention[0]}%</p>
                <p>D7: {analytics.retention[1]}%</p>
                <p>D30: {analytics.retention[2]}%</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-surface p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Daily Graph</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.dailySeries.at(-1)} scans</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Adjusts with 1D / 7D / 30D</p>
            <InteractiveLineChart values={analytics.dailySeries} areaValues={analytics.dailySeries} />
          </article>

          <article className="flex min-h-80 flex-col rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4 xl:row-span-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Fresh vs Not Fresh</p>
            <p className="mt-2 text-4xl font-semibold">{analytics.freshness.fresh}% / {analytics.freshness.notFresh}%</p>
            <p className="mt-1 text-base text-[rgba(50,52,62,0.7)]">Classification distribution</p>
            <div className="flex flex-1 items-center justify-center">
              <svg viewBox="0 0 180 180" className="h-44 w-44 text-primary sm:h-52 sm:w-52">
                <circle cx="90" cy="90" r="62" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="28" />
                <circle
                  cx="90"
                  cy="90"
                  r="62"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="28"
                  strokeDasharray={`${(analytics.freshness.fresh / 100) * 390} 390`}
                  strokeDashoffset="65"
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-[rgba(50,52,62,0.85)]">Fresh ({analytics.freshness.fresh}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[rgba(40,90,83,0.3)]" />
                <span className="text-[rgba(50,52,62,0.85)]">Not Fresh ({analytics.freshness.notFresh}%)</span>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Vegetable Popularity</p>
            <p className="mt-2 text-3xl font-semibold">Top scanned vegetables</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Tomato, Carrot, Cabbage</p>
            <div className="mt-4 flex h-36 items-end gap-3">
              {popularityBars.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end rounded-xl bg-surface p-1">
                    <div className="w-full rounded-lg bg-primary" style={{ height: item.height }} />
                  </div>
                  <p className="text-[11px] font-medium text-[rgba(50,52,62,0.7)]">{item.label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Confidence Distribution</p>
            <p className="mt-2 text-3xl font-semibold">0.82 avg</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Histogram / confidence bins</p>
            <div className="mt-4 flex h-36 items-end gap-2">
              {analytics.confidence.map((value, index) => (
                <div key={index} className="flex-1 rounded-t-lg bg-[rgba(40,90,83,0.35)]" style={{ height: `${value}%` }} />
              ))}
            </div>
          </article>

          <article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-8 xl:col-start-5">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Dataset Download Analytics</p>
            <p className="mt-2 text-3xl font-semibold">1.9k downloads</p>
            <p className="mt-1 text-sm opacity-85">Counts per dataset</p>
            <div className="mt-4 space-y-3">
              {analytics.downloads.map((item, index) => (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{vegetableLabels[index]}</span>
                    <span>{item}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.15)]">
                    <div className="h-2 rounded-full bg-white" style={{ width: `${item}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4 xl:col-start-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Data Consistency</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.consistency}</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Totals match database report</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-[rgba(50,52,62,0.7)]">Analytics</p>
                <p className="mt-1 font-semibold">{analytics.overviewTotal} total</p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-[rgba(50,52,62,0.7)]">Database</p>
                <p className="mt-1 font-semibold">{analytics.overviewTotal} total</p>
              </div>
            </div>
          </article>
      </div>
    </section>
  )
}

export default DashboardPage
