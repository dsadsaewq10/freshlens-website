import { useMemo, useState } from 'react'

// TODO: replace mock data with Supabase query (table: user_captures, bucket: captures/)
const initialCaptures = [
	{
		id: 'cap-1001',
		user: 'acno',
		vegetable: 'Tomato',
		capturedAt: '2026-04-11 08:22',
		yoloLabel: 'tomato-fresh',
		yoloConfidence: 0.92,
		userLabel: 'fresh',
		freshness: 'Fresh',
		resolution: '1440x1920',
		reviewStatus: 'Pending',
	},
	{
		id: 'cap-1002',
		user: 'jv',
		vegetable: 'Carrot',
		capturedAt: '2026-04-11 13:05',
		yoloLabel: 'carrot-fresh',
		yoloConfidence: 0.78,
		userLabel: 'not-fresh',
		freshness: 'Not Fresh',
		resolution: '1080x1920',
		reviewStatus: 'Pending',
	},
	{
		id: 'cap-1003',
		user: 'pin',
		vegetable: 'Cabbage',
		capturedAt: '2026-04-12 09:44',
		yoloLabel: 'cabbage-not-fresh',
		yoloConfidence: 0.71,
		userLabel: 'not-fresh',
		freshness: 'Not Fresh',
		resolution: '1440x1920',
		reviewStatus: 'Approved',
	},
	{
		id: 'cap-1004',
		user: 'than',
		vegetable: 'Pepper',
		capturedAt: '2026-04-12 15:17',
		yoloLabel: 'pepper-fresh',
		yoloConfidence: 0.88,
		userLabel: 'fresh',
		freshness: 'Fresh',
		resolution: '1080x1440',
		reviewStatus: 'Approved',
	},
	{
		id: 'cap-1005',
		user: 'acno',
		vegetable: 'Cucumber',
		capturedAt: '2026-04-13 07:36',
		yoloLabel: 'cucumber-fresh',
		yoloConfidence: 0.65,
		userLabel: 'fresh',
		freshness: 'Fresh',
		resolution: '1080x1920',
		reviewStatus: 'Pending',
	},
	{
		id: 'cap-1006',
		user: 'jv',
		vegetable: 'Tomato',
		capturedAt: '2026-04-13 12:10',
		yoloLabel: 'tomato-not-fresh',
		yoloConfidence: 0.82,
		userLabel: 'not-fresh',
		freshness: 'Not Fresh',
		resolution: '1440x1920',
		reviewStatus: 'Rejected',
	},
	{
		id: 'cap-1007',
		user: 'pin',
		vegetable: 'Carrot',
		capturedAt: '2026-04-14 06:50',
		yoloLabel: 'carrot-fresh',
		yoloConfidence: 0.94,
		userLabel: 'fresh',
		freshness: 'Fresh',
		resolution: '1080x1920',
		reviewStatus: 'Pending',
	},
	{
		id: 'cap-1008',
		user: 'than',
		vegetable: 'Pepper',
		capturedAt: '2026-04-14 11:02',
		yoloLabel: 'pepper-not-fresh',
		yoloConfidence: 0.58,
		userLabel: 'fresh',
		freshness: 'Fresh',
		resolution: '1080x1440',
		reviewStatus: 'Pending',
	},
]

const vegetableOptions = ['All', 'Tomato', 'Carrot', 'Cabbage', 'Pepper', 'Cucumber']
const freshnessOptions = ['All', 'Fresh', 'Not Fresh']
const reviewOptions = ['All', 'Pending', 'Approved', 'Rejected']

function reviewClass(status) {
	if (status === 'Approved') return 'bg-emerald-100 text-emerald-700'
	if (status === 'Pending') return 'bg-amber-100 text-amber-700'
	return 'bg-rose-100 text-rose-700'
}

function confidenceClass(value) {
	if (value >= 0.85) return 'text-emerald-700'
	if (value >= 0.7) return 'text-amber-700'
	return 'text-rose-700'
}

function Thumbnail({ vegetable }) {
	const letter = vegetable.slice(0, 1).toUpperCase()
	return (
		<div className="flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
			{letter}
		</div>
	)
}

function DatasetRetrievalPage() {
	const [captures, setCaptures] = useState(initialCaptures)
	const [search, setSearch] = useState('')
	const [vegetableFilter, setVegetableFilter] = useState('All')
	const [freshnessFilter, setFreshnessFilter] = useState('All')
	const [reviewFilter, setReviewFilter] = useState('All')
	const [labelMismatchOnly, setLabelMismatchOnly] = useState(false)
	const [selectedIds, setSelectedIds] = useState(() => new Set())
	const [toast, setToast] = useState('')

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return captures.filter((c) => {
			const byText =
				q.length === 0 ||
				c.id.toLowerCase().includes(q) ||
				c.user.toLowerCase().includes(q) ||
				c.vegetable.toLowerCase().includes(q)
			const byVegetable = vegetableFilter === 'All' || c.vegetable === vegetableFilter
			const byFreshness = freshnessFilter === 'All' || c.freshness === freshnessFilter
			const byReview = reviewFilter === 'All' || c.reviewStatus === reviewFilter
			const mismatch = !labelMismatchOnly || c.yoloLabel.split('-').slice(1).join('-') !== c.userLabel
			return byText && byVegetable && byFreshness && byReview && mismatch
		})
	}, [captures, search, vegetableFilter, freshnessFilter, reviewFilter, labelMismatchOnly])

	const stats = useMemo(() => {
		const total = captures.length
		const pending = captures.filter((c) => c.reviewStatus === 'Pending').length
		const approved = captures.filter((c) => c.reviewStatus === 'Approved').length
		const mismatch = captures.filter(
			(c) => c.yoloLabel.split('-').slice(1).join('-') !== c.userLabel,
		).length
		return { total, pending, approved, mismatch }
	}, [captures])

	function toggleSelect(id) {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	function selectAllFiltered() {
		setSelectedIds(new Set(filtered.map((c) => c.id)))
	}

	function clearSelection() {
		setSelectedIds(new Set())
	}

	function updateReviewStatus(ids, nextStatus) {
		setCaptures((prev) =>
			prev.map((c) => (ids.has(c.id) ? { ...c, reviewStatus: nextStatus } : c)),
		)
		setToast(`Marked ${ids.size} capture(s) as ${nextStatus}.`)
	}

	function approveSelection() {
		if (selectedIds.size === 0) return
		updateReviewStatus(selectedIds, 'Approved')
	}

	function rejectSelection() {
		if (selectedIds.size === 0) return
		updateReviewStatus(selectedIds, 'Rejected')
	}

	function bundleSelectionForRelease() {
		if (selectedIds.size === 0) return
		// TODO: write a "pending release" record to Supabase so dataset-release page can pick it up
		const bundle = captures.filter((c) => selectedIds.has(c.id))
		console.log('pending release bundle (stub)', bundle)
		setToast(`Bundled ${bundle.length} capture(s). Head to "Dataset Release" to publish.`)
	}

	return (
		<section className="space-y-5">
			<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
				<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dataset retrieval</h1>
						<p className="mt-1 text-sm text-slate-500">
							User-captured images from the mobile app. Review labels, approve for the YOLO retraining pool, and
							bundle a release.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={bundleSelectionForRelease}
							disabled={selectedIds.size === 0}
							className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Bundle for release ({selectedIds.size})
						</button>
					</div>
				</div>

				<div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{[
						{ label: 'Total captures', value: stats.total },
						{ label: 'Pending review', value: stats.pending },
						{ label: 'Approved', value: stats.approved },
						{ label: 'Label mismatches', value: stats.mismatch },
					].map((card) => (
						<div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
							<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
							<p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
						</div>
					))}
				</div>

				<div className="mb-4 flex flex-wrap gap-2">
					<input
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by id, user, or vegetable"
						className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
					/>
					<select
						value={vegetableFilter}
						onChange={(event) => setVegetableFilter(event.target.value)}
						className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400"
					>
						{vegetableOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<select
						value={freshnessFilter}
						onChange={(event) => setFreshnessFilter(event.target.value)}
						className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400"
					>
						{freshnessOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<select
						value={reviewFilter}
						onChange={(event) => setReviewFilter(event.target.value)}
						className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400"
					>
						{reviewOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
						<input
							type="checkbox"
							checked={labelMismatchOnly}
							onChange={(event) => setLabelMismatchOnly(event.target.checked)}
						/>
						Mismatches only
					</label>
				</div>

				<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
					<button
						type="button"
						onClick={selectAllFiltered}
						className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-100"
					>
						Select all filtered
					</button>
					<button
						type="button"
						onClick={clearSelection}
						className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium hover:bg-slate-100"
					>
						Clear
					</button>
					<button
						type="button"
						onClick={approveSelection}
						disabled={selectedIds.size === 0}
						className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Approve selected
					</button>
					<button
						type="button"
						onClick={rejectSelection}
						disabled={selectedIds.size === 0}
						className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Reject selected
					</button>
				</div>

				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{filtered.map((capture) => {
						const modelLabel = capture.yoloLabel.split('-').slice(1).join('-')
						const mismatch = modelLabel !== capture.userLabel
						const isSelected = selectedIds.has(capture.id)
						return (
							<article
								key={capture.id}
								className={`rounded-2xl border p-3 transition ${
									isSelected ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'
								}`}
							>
								<div className="mb-3 flex items-start justify-between gap-2">
									<label className="flex items-center gap-2 text-xs font-mono text-slate-500">
										<input type="checkbox" checked={isSelected} onChange={() => toggleSelect(capture.id)} />
										{capture.id}
									</label>
									<span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${reviewClass(capture.reviewStatus)}`}>
										{capture.reviewStatus}
									</span>
								</div>
								<Thumbnail vegetable={capture.vegetable} />
								<div className="mt-3 space-y-1 text-xs text-slate-600">
									<p className="text-sm font-semibold text-slate-900">
										{capture.vegetable} · {capture.freshness}
									</p>
									<p>
										YOLO: <span className="font-mono">{capture.yoloLabel}</span>{' '}
										<span className={`font-semibold ${confidenceClass(capture.yoloConfidence)}`}>
											({(capture.yoloConfidence * 100).toFixed(0)}%)
										</span>
									</p>
									<p>User label: {capture.userLabel}</p>
									{mismatch && (
										<p className="rounded-md bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">
											Label mismatch
										</p>
									)}
									<p>
										{capture.user} · {capture.capturedAt} · {capture.resolution}
									</p>
								</div>
							</article>
						)
					})}
				</div>
				{filtered.length === 0 && (
					<p className="pt-6 text-center text-sm text-slate-500">No captures match the current filter.</p>
				)}

				{toast && (
					<p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-medium text-emerald-700">
						{toast}
					</p>
				)}
			</div>
		</section>
	)
}

export default DatasetRetrievalPage
