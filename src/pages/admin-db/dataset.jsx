import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTIONS = ['All', 'Draft', 'Review', 'Published', 'Archived']

function formatNumber(n) {
	if (n == null) return '0'
	return Number(n).toLocaleString()
}

function vegFromLabel(label) {
	if (!label) return 'Unknown'
	const base = label.toLowerCase().replace(/^(fresh|rotten)[ _-]?/, '').trim()
	if (!base) return 'Unknown'
	return base.charAt(0).toUpperCase() + base.slice(1)
}

function DatasetPage() {
	const [releases, setReleases] = useState([])
	const [scans, setScans] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [datasetSearch, setDatasetSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('All')

	useEffect(() => {
		let cancelled = false
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const [relRes, scanRes] = await Promise.all([
					supabase
						.from('dataset_releases')
						.select('id, name, version, vegetables, sample_count, fresh_ratio, status, updated_at, public_url')
						.order('updated_at', { ascending: false }),
					supabase
						.from('scan_history')
						.select('class_label, reviewed_class_label, is_fresh, review_status')
						.limit(5000),
				])
				if (relRes.error) throw relRes.error
				if (scanRes.error) throw scanRes.error
				if (cancelled) return
				setReleases(relRes.data ?? [])
				setScans(scanRes.data ?? [])
			} catch (e) {
				if (!cancelled) setError(e.message ?? 'Failed to load datasets')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [])

	const filteredReleases = useMemo(() => {
		const q = datasetSearch.trim().toLowerCase()
		return releases.filter((r) => {
			const name = (r.name ?? '').toLowerCase()
			const vegs = (r.vegetables ?? []).join(' ').toLowerCase()
			const bySearch = q.length === 0 || name.includes(q) || vegs.includes(q)
			const byStatus = statusFilter === 'All' || r.status === statusFilter
			return bySearch && byStatus
		})
	}, [releases, datasetSearch, statusFilter])

	const freshness = useMemo(() => {
		let fresh = 0
		let total = 0
		for (const s of scans) {
			total += 1
			if (s.is_fresh) fresh += 1
		}
		if (total === 0) return { fresh: 0, notFresh: 0, total: 0 }
		const freshPct = Math.round((fresh / total) * 100)
		return { fresh: freshPct, notFresh: 100 - freshPct, total }
	}, [scans])

	const popularity = useMemo(() => {
		const counts = new Map()
		for (const s of scans) {
			const veg = vegFromLabel(s.reviewed_class_label || s.class_label)
			counts.set(veg, (counts.get(veg) ?? 0) + 1)
		}
		const sorted = [...counts.entries()]
			.filter(([veg]) => veg !== 'Unknown')
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
		const max = sorted.length ? sorted[0][1] : 1
		return sorted.map(([label, value]) => ({
			label,
			value,
			height: `${(value / max) * 100}%`,
		}))
	}, [scans])

	const releaseSamples = useMemo(() => {
		const published = releases.filter((r) => r.status === 'Published')
		const byVeg = new Map()
		for (const r of published) {
			for (const v of r.vegetables ?? []) {
				const label = vegFromLabel(v)
				byVeg.set(label, (byVeg.get(label) ?? 0) + (r.sample_count ?? 0))
			}
		}
		const sorted = [...byVeg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
		const totalSamples = sorted.reduce((acc, [, v]) => acc + v, 0)
		const max = sorted.length ? sorted[0][1] : 1
		return {
			totalSamples,
			publishedCount: published.length,
			items: sorted.map(([label, value]) => ({
				label,
				value,
				width: `${(value / max) * 100}%`,
			})),
		}
	}, [releases])

	return (
		<section className="space-y-5">
			<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Vegetable datasets</h1>
					<div className="flex w-full flex-wrap gap-2 sm:w-auto">
						<input
							type="search"
							value={datasetSearch}
							onChange={(event) => setDatasetSearch(event.target.value)}
							placeholder="Search dataset"
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						/>
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						>
							{STATUS_OPTIONS.map((s) => (
								<option key={s} value={s}>
									{s === 'All' ? 'All statuses' : s}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading && <p className="py-6 text-center text-sm text-slate-500">Loading datasets…</p>}
				{error && (
					<p className="py-6 text-center text-sm text-red-600">Failed to load datasets: {error}</p>
				)}

				{!loading && !error && (
					<>
						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{filteredReleases.map((release) => {
								const freshPct = Math.round((release.fresh_ratio ?? 0) * 100)
								const vegs = (release.vegetables ?? []).map(vegFromLabel).join(', ') || '—'
								return (
									<article
										key={release.id}
										className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
									>
										<div className="flex items-start justify-between gap-2">
											<p className="text-sm font-semibold text-slate-800">{release.name}</p>
											<span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
												{release.status ?? 'Draft'}
											</span>
										</div>
										<div className="mt-3 space-y-1 text-xs text-slate-600">
											<p>Version: {release.version ?? '—'}</p>
											<p>Records: {formatNumber(release.sample_count)}</p>
											<p>Vegetables: {vegs}</p>
											<p>Fresh samples: {freshPct}%</p>
										</div>
									</article>
								)
							})}
						</div>
						{filteredReleases.length === 0 && (
							<p className="pt-6 text-center text-sm text-slate-500">
								{releases.length === 0
									? 'No dataset releases yet. Create one from the Dataset Release tab.'
									: 'No dataset matches your search/filter.'}
							</p>
						)}
					</>
				)}

				<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
					<article className="flex min-h-80 flex-col rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
						<p className="text-sm font-semibold uppercase tracking-wide text-accent/70">Fresh vs Not Fresh</p>
						<p className="mt-2 text-4xl font-semibold">
							{freshness.fresh}% / {freshness.notFresh}%
						</p>
						<p className="mt-1 text-base text-accent/70">
							Based on {formatNumber(freshness.total)} scans
						</p>
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
									strokeDasharray={`${(freshness.fresh / 100) * 390} 390`}
									strokeDashoffset="65"
									strokeLinecap="round"
									transform="rotate(-90 90 90)"
								/>
							</svg>
						</div>
						<div className="mt-2 flex items-center justify-center gap-6 text-sm font-medium">
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-primary" />
								<span className="text-accent/85">Fresh ({freshness.fresh}%)</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-primary/30" />
								<span className="text-accent/85">Not Fresh ({freshness.notFresh}%)</span>
							</div>
						</div>
					</article>

					<article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-accent/70">Vegetable Popularity</p>
						<p className="mt-2 text-3xl font-semibold">Top scanned categories</p>
						<p className="mt-1 text-sm text-accent/70">Based on scan history volume</p>
						<div className="mt-4 flex h-40 items-end gap-3">
							{popularity.length === 0 && (
								<p className="w-full text-center text-xs text-accent/60">No scans yet.</p>
							)}
							{popularity.map((item) => (
								<div key={item.label} className="flex flex-1 flex-col items-center gap-2">
									<div className="flex h-full w-full items-end rounded-xl bg-surface p-1">
										<div
											className="w-full rounded-lg bg-primary"
											style={{ height: item.height }}
											title={`${item.value} scans`}
										/>
									</div>
									<p className="text-[11px] font-medium text-accent/70">{item.label}</p>
								</div>
							))}
						</div>
					</article>

					<article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-4">
						<p className="text-xs font-semibold uppercase tracking-wide opacity-80">Published Dataset Samples</p>
						<p className="mt-2 text-3xl font-semibold">
							{formatNumber(releaseSamples.totalSamples)} samples
						</p>
						<p className="mt-1 text-sm opacity-85">
							Across {releaseSamples.publishedCount} published release
							{releaseSamples.publishedCount === 1 ? '' : 's'}
						</p>
						<div className="mt-4 space-y-3">
							{releaseSamples.items.length === 0 && (
								<p className="text-xs opacity-80">No published releases yet.</p>
							)}
							{releaseSamples.items.map((item) => (
								<div key={item.label}>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span>{item.label}</span>
										<span>{formatNumber(item.value)}</span>
									</div>
									<div className="h-2 rounded-full bg-white/15">
										<div className="h-2 rounded-full bg-white" style={{ width: item.width }} />
									</div>
								</div>
							))}
						</div>
					</article>
				</div>
			</div>
		</section>
	)
}

export default DatasetPage
