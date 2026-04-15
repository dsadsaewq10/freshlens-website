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

function formatNumber(value) {
  if (value == null) return '0'
  return Number(value).toLocaleString()
}

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

function InteractiveLineChart({
  values,
  secondaryValues,
  areaValues,
  width = 420,
  height = 180,
  chartClassName = 'mt-4 h-32 w-full text-primary sm:h-36',
}) {
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
    <svg viewBox={`0 0 ${width} ${height}`} className={chartClassName}>
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

function buildDateLabels(count, selectedPeriod) {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const totalDays = selectedPeriod === '1D' ? 1 : selectedPeriod === '7D' ? 7 : 30

  return Array.from({ length: count }, (_, index) => {
    const stepRatio = count <= 1 ? 0 : (count - 1 - index) / (count - 1)
    const dayOffset = Math.round(stepRatio * (totalDays - 1))
    const day = new Date(today)
    day.setDate(today.getDate() - dayOffset)
    return formatter.format(day)
  })
}

function DauMauBarChart({ dauValues, mauValues, selectedPeriod }) {
  const dauCounts = dauValues.map((value) => Math.round(value * 1000))
  const mauCounts = mauValues.map((value) => Math.round(value * 1000))
  const dateLabels = useMemo(
    () => buildDateLabels(dauCounts.length, selectedPeriod),
    [dauCounts.length, selectedPeriod],
  )

  const baseMax = Math.max(...dauCounts, ...mauCounts, 3000)
  const tickStep = baseMax <= 10000 ? 1000 : baseMax <= 20000 ? 2000 : baseMax <= 50000 ? 5000 : 10000
  const yMax = Math.ceil(baseMax / tickStep) * tickStep
  const yTicks = Array.from({ length: yMax / tickStep + 1 }, (_, index) => index * tickStep)

  const width = 860
  const height = 370
  const leftPadding = 60
  const rightPadding = 18
  const topPadding = 20
  const bottomPadding = 62
  const chartWidth = width - leftPadding - rightPadding
  const chartHeight = height - topPadding - bottomPadding
  const groupWidth = chartWidth / Math.max(dauCounts.length, 1)
  const barWidth = Math.max(5, Math.min(16, groupWidth * 0.22))
  const groupGap = Math.max(2, Math.min(10, groupWidth * 0.1))

  const toY = (value) => topPadding + chartHeight - (value / yMax) * chartHeight
  const axisBottomY = topPadding + chartHeight

  const shouldRotateXLabels = dateLabels.length > 8

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-72 w-full">
        <line
          x1={leftPadding}
          y1={topPadding}
          x2={leftPadding}
          y2={axisBottomY}
          stroke="rgba(100,116,139,0.6)"
          strokeWidth="1"
        />
        <line
          x1={leftPadding}
          y1={axisBottomY}
          x2={leftPadding + chartWidth}
          y2={axisBottomY}
          stroke="rgba(100,116,139,0.6)"
          strokeWidth="1"
        />

        {yTicks.map((tick) => {
          const y = toY(tick)
          return (
            <g key={tick}>
              <line
                x1={leftPadding}
                y1={y}
                x2={leftPadding + chartWidth}
                y2={y}
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="1"
              />
              <text
                x={leftPadding - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="rgba(71,85,105,0.9)"
              >
                {formatNumber(tick)}
              </text>
            </g>
          )
        })}

        {dauCounts.map((dauValue, index) => {
          const mauValue = mauCounts[index] ?? 0
          const groupStartX = leftPadding + index * groupWidth
          const dauX = groupStartX + groupWidth / 2 - barWidth - groupGap / 2
          const mauX = groupStartX + groupWidth / 2 + groupGap / 2
          const dauY = toY(dauValue)
          const mauY = toY(mauValue)
          const labelX = groupStartX + groupWidth / 2

          return (
            <g key={index}>
              <rect
                x={dauX}
                y={dauY}
                width={barWidth}
                height={Math.max(2, axisBottomY - dauY)}
                rx="3"
                fill="rgba(15,109,118,0.95)"
              />
              <rect
                x={mauX}
                y={mauY}
                width={barWidth}
                height={Math.max(2, axisBottomY - mauY)}
                rx="3"
                fill="rgba(15,109,118,0.35)"
              />

              {shouldRotateXLabels ? (
                <text
                  x={labelX}
                  y={axisBottomY + 20}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(51,65,85,0.95)"
                  transform={`rotate(-35 ${labelX} ${axisBottomY + 20})`}
                >
                  {dateLabels[index]}
                </text>
              ) : (
                <text
                  x={labelX}
                  y={axisBottomY + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgba(51,65,85,0.95)"
                >
                  {dateLabels[index]}
                </text>
              )}
            </g>
          )
        })}

        <text
          x={leftPadding + chartWidth / 2}
          y={height - 6}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(71,85,105,0.95)"
        >
          Date (X-axis)
        </text>
        <text
          x="16"
          y={topPadding + chartHeight / 2}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(71,85,105,0.95)"
          transform={`rotate(-90 16 ${topPadding + chartHeight / 2})`}
        >
          Users (Y-axis)
        </text>
      </svg>

      <div className="mt-3 flex items-center justify-center gap-6 text-xs font-medium text-[rgba(50,52,62,0.8)]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>DAU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/35" />
          <span>MAU</span>
        </div>
      </div>
    </>
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

  const totalDownloadCount = useMemo(
    () => analytics.downloads.reduce((sum, value) => sum + value, 0),
    [analytics.downloads],
  )
  const maxDownloadCount = Math.max(...analytics.downloads, 1)

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
          <p className="rounded-xl bg-surface px-3 py-2 text-xs font-medium text-accent/80">Tuesday, 9th March</p>
        </div>
        {exportError && <p className="w-full text-xs font-medium text-[rgb(220,38,38)]">{exportError}</p>}
      </div>

      <div className="grid auto-rows-[minmax(220px,auto)] gap-4 sm:grid-cols-2 xl:grid-cols-12">
          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-8 xl:min-h-130">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">DAU / MAU Metrics</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.dau}k / {analytics.mau}k</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Daily and monthly active users</p>
            <DauMauBarChart dauValues={analytics.dauSeries} mauValues={analytics.mauSeries} selectedPeriod={selectedPeriod} />
          </article>

          <article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">New User Trend</p>
            <p className="mt-2 text-3xl font-semibold">+{analytics.newUsers}%</p>
            <p className="mt-1 text-sm text-white/80">Registration trend accuracy</p>
            <InteractiveLineChart
              values={analytics.newUserSeries}
              areaValues={analytics.newUserSeries}
              height={370}
              chartClassName="mt-4 h-72 w-full text-white"
            />
          </article>

          <article className="rounded-2xl bg-surface p-4 text-accent sm:col-span-2 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(50,52,62,0.7)]">Daily Graph</p>
            <p className="mt-2 text-3xl font-semibold">{analytics.dailySeries.at(-1)} scans</p>
            <p className="mt-1 text-sm text-[rgba(50,52,62,0.7)]">Adjusts with 1D / 7D / 30D</p>
            <InteractiveLineChart values={analytics.dailySeries} areaValues={analytics.dailySeries} />
          </article>

          <article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-8">
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

          <article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-12">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Dataset Download Analytics</p>
            <p className="mt-2 text-3xl font-semibold">{formatNumber(totalDownloadCount)} downloads</p>
            <p className="mt-1 text-sm opacity-85">Counts per dataset</p>
            <div className="mt-4 space-y-3">
              {analytics.downloads.map((item, index) => (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{vegetableLabels[index]}</span>
                    <span>{formatNumber(item)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.15)]">
                    <div className="h-2 rounded-full bg-white" style={{ width: `${(item / maxDownloadCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

      </div>
    </section>
  )
}

export default DashboardPage
