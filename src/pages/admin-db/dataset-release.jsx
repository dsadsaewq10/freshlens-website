import { useMemo, useState } from 'react'

// TODO: replace mock releases with Supabase query (table: dataset_releases, bucket: public-datasets/)
// Publishing flow should:
//   1. Zip the bundle of approved captures + metadata (JSONL of labels).
//   2. Upload the archive to the public `datasets` bucket in Supabase Storage.
//   3. Insert a row into `dataset_releases` with version, changelog, public URL.
//   4. Flip status to "Published" and expose the public URL on the landing page.
const initialReleases = [
	{
		id: 'rel-0007',
		name: 'FreshLens Tomato v1.3',
		version: '1.3.0',
		vegetables: ['Tomato'],
		sampleCount: 4820,
		freshRatio: 0.68,
		sizeMb: 612,
		status: 'Published',
		updatedAt: '2026-04-05',
		changelog: 'Added 1.2k user captures from mobile app beta (week 13).',
		publicUrl: 'https://<project>.supabase.co/storage/v1/object/public/datasets/tomato-v1-3.zip',
	},
	{
		id: 'rel-0008',
		name: 'FreshLens Leafy Greens v0.9',
		version: '0.9.0',
		vegetables: ['Cabbage', 'Lettuce'],
		sampleCount: 2640,
		freshRatio: 0.72,
		sizeMb: 418,
		status: 'Draft',
		updatedAt: '2026-04-12',
		changelog: 'First internal build. Label review in progress.',
		publicUrl: '',
	},
	{
		id: 'rel-0009',
		name: 'FreshLens Root Veg v1.1',
		version: '1.1.0',
		vegetables: ['Carrot', 'Radish'],
		sampleCount: 3180,
		freshRatio: 0.65,
		sizeMb: 540,
		status: 'Review',
		updatedAt: '2026-04-13',
		changelog: 'Rebalanced non-fresh samples from 22% → 35%.',
		publicUrl: '',
	},
]

const statusOptions = ['All', 'Draft', 'Review', 'Published', 'Archived']

function statusClass(status) {
	if (status === 'Published') return 'bg-emerald-100 text-emerald-700'
	if (status === 'Review') return 'bg-sky-100 text-sky-700'
	if (status === 'Draft') return 'bg-amber-100 text-amber-700'
	return 'bg-slate-200 text-slate-700'
}

function DatasetReleasePage() {
	const [releases, setReleases] = useState(initialReleases)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('All')
	const [isComposerOpen, setIsComposerOpen] = useState(false)
	const [composer, setComposer] = useState({
		name: '',
		version: '',
		vegetables: '',
		changelog: '',
	})
	const [selected, setSelected] = useState(null)
	const [pendingAction, setPendingAction] = useState(null)
	const [toast, setToast] = useState('')

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return releases.filter((r) => {
			const byText =
				q.length === 0 ||
				r.name.toLowerCase().includes(q) ||
				r.version.toLowerCase().includes(q) ||
				r.vegetables.join(' ').toLowerCase().includes(q)
			const byStatus = statusFilter === 'All' || r.status === statusFilter
			return byText && byStatus
		})
	}, [releases, search, statusFilter])

	const stats = useMemo(() => {
		const published = releases.filter((r) => r.status === 'Published').length
		const drafts = releases.filter((r) => r.status === 'Draft' || r.status === 'Review').length
		const totalSamples = releases.reduce((sum, r) => sum + r.sampleCount, 0)
		const totalSize = releases.reduce((sum, r) => sum + r.sizeMb, 0)
		return { published, drafts, totalSamples, totalSize }
	}, [releases])

	function openComposer() {
		setComposer({ name: '', version: '', vegetables: '', changelog: '' })
		setIsComposerOpen(true)
	}

	function saveDraftRelease() {
		if (!composer.name.trim() || !composer.version.trim()) {
			setToast('Name and version are required.')
			return
		}
		const next = {
			id: `rel-${String(10 + releases.length).padStart(4, '0')}`,
			name: composer.name.trim(),
			version: composer.version.trim(),
			vegetables: composer.vegetables
				.split(',')
				.map((v) => v.trim())
				.filter(Boolean),
			sampleCount: 0,
			freshRatio: 0,
			sizeMb: 0,
			status: 'Draft',
			updatedAt: new Date().toISOString().slice(0, 10),
			changelog: composer.changelog.trim(),
			publicUrl: '',
		}
		setReleases((prev) => [next, ...prev])
		setIsComposerOpen(false)
		setToast(`Draft "${next.name}" created. Attach an approved capture bundle from Dataset Retrieval.`)
	}

	function requestAction(release, action) {
		setSelected(release)
		setPendingAction(action)
	}

	function closeConfirm() {
		setSelected(null)
		setPendingAction(null)
	}

	function runAction() {
		if (!selected || !pendingAction) return
		if (pendingAction === 'publish') {
			// TODO: upload archive to Supabase Storage, then insert into dataset_releases
			const fakeUrl = `https://<project>.supabase.co/storage/v1/object/public/datasets/${selected.id}.zip`
			setReleases((prev) =>
				prev.map((r) =>
					r.id === selected.id
						? { ...r, status: 'Published', publicUrl: fakeUrl, updatedAt: new Date().toISOString().slice(0, 10) }
						: r,
				),
			)
			setToast(`Published ${selected.name}. Public URL generated (stub).`)
		} else if (pendingAction === 'archive') {
			setReleases((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: 'Archived' } : r)))
			setToast(`Archived ${selected.name}.`)
		} else if (pendingAction === 'delete') {
			setReleases((prev) => prev.filter((r) => r.id !== selected.id))
			setToast(`Deleted ${selected.name}.`)
		} else if (pendingAction === 'review') {
			setReleases((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: 'Review' } : r)))
			setToast(`${selected.name} moved to Review.`)
		}
		closeConfirm()
	}

	function copyUrl(url) {
		if (!url) return
		navigator.clipboard?.writeText(url)
		setToast('Public URL copied to clipboard.')
	}

	return (
		<>
			<section className="space-y-5">
				<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
					<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
						<div>
							<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dataset release</h1>
							<p className="mt-1 text-sm text-slate-500">
								Compile approved captures into public dataset releases. Publishing uploads the archive to
								Supabase Storage and exposes a public URL on the landing page.
							</p>
						</div>
						<button
							type="button"
							onClick={openComposer}
							className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
						>
							New release
						</button>
					</div>

					<div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						{[
							{ label: 'Published', value: stats.published },
							{ label: 'Drafts / review', value: stats.drafts },
							{ label: 'Total samples', value: stats.totalSamples.toLocaleString() },
							{ label: 'Total size', value: `${stats.totalSize} MB` },
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
							placeholder="Search release name, version, or vegetable"
							className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						/>
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400"
						>
							{statusOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-3">
						{filtered.map((release) => (
							<article key={release.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-mono text-slate-500">{release.id}</span>
											<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(release.status)}`}>
												{release.status}
											</span>
											<span className="text-xs font-semibold text-slate-700">v{release.version}</span>
										</div>
										<p className="mt-2 text-base font-semibold text-slate-900">{release.name}</p>
										<p className="mt-1 text-xs text-slate-600">{release.changelog}</p>
										<div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
											<span>{release.sampleCount.toLocaleString()} samples</span>
											<span>{release.sizeMb} MB</span>
											<span>Fresh ratio {(release.freshRatio * 100).toFixed(0)}%</span>
											<span>Vegetables: {release.vegetables.join(', ') || '—'}</span>
											<span>Updated {release.updatedAt}</span>
										</div>
										{release.publicUrl && (
											<div className="mt-3 flex flex-wrap items-center gap-2">
												<code className="max-w-full truncate rounded-md bg-slate-900/90 px-2 py-1 text-[11px] text-emerald-200">
													{release.publicUrl}
												</code>
												<button
													type="button"
													onClick={() => copyUrl(release.publicUrl)}
													className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
												>
													Copy URL
												</button>
											</div>
										)}
									</div>
									<div className="flex flex-wrap justify-end gap-2">
										{release.status === 'Draft' && (
											<button
												type="button"
												onClick={() => requestAction(release, 'review')}
												className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700"
											>
												Send to review
											</button>
										)}
										{release.status !== 'Published' && release.status !== 'Archived' && (
											<button
												type="button"
												onClick={() => requestAction(release, 'publish')}
												className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
											>
												Publish
											</button>
										)}
										{release.status === 'Published' && (
											<button
												type="button"
												onClick={() => requestAction(release, 'archive')}
												className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
											>
												Archive
											</button>
										)}
										<button
											type="button"
											onClick={() => requestAction(release, 'delete')}
											className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
										>
											Delete
										</button>
									</div>
								</div>
							</article>
						))}
						{filtered.length === 0 && (
							<p className="pt-6 text-center text-sm text-slate-500">No releases match the current filter.</p>
						)}
					</div>

					{toast && (
						<p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-medium text-emerald-700">
							{toast}
						</p>
					)}
				</div>
			</section>

			{isComposerOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<div className="mb-4 flex items-start justify-between gap-2">
							<div>
								<h2 className="text-xl font-semibold text-slate-900">New dataset release</h2>
								<p className="text-sm text-slate-500">Create a draft. You can attach approved captures and publish later.</p>
							</div>
							<button
								type="button"
								onClick={() => setIsComposerOpen(false)}
								className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
							>
								Close
							</button>
						</div>
						<div className="space-y-3">
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Name</span>
								<input
									type="text"
									value={composer.name}
									onChange={(event) => setComposer({ ...composer, name: event.target.value })}
									placeholder="FreshLens Tomato v1.4"
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Version</span>
								<input
									type="text"
									value={composer.version}
									onChange={(event) => setComposer({ ...composer, version: event.target.value })}
									placeholder="1.4.0"
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Vegetables (comma separated)</span>
								<input
									type="text"
									value={composer.vegetables}
									onChange={(event) => setComposer({ ...composer, vegetables: event.target.value })}
									placeholder="Tomato, Pepper"
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Changelog</span>
								<textarea
									value={composer.changelog}
									onChange={(event) => setComposer({ ...composer, changelog: event.target.value })}
									rows={4}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setIsComposerOpen(false)}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={saveDraftRelease}
								className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
							>
								Save draft
							</button>
						</div>
					</div>
				</div>
			)}

			{selected && pendingAction && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<h2 className="text-lg font-semibold text-slate-900">Confirm {pendingAction}</h2>
						<p className="mt-2 text-sm text-slate-600">
							{pendingAction === 'publish' &&
								'Publishing uploads the archive to Supabase Storage and exposes a public URL. Continue?'}
							{pendingAction === 'archive' && `Archive "${selected.name}"? It will remain downloadable but hidden from the landing page.`}
							{pendingAction === 'delete' && `Permanently delete "${selected.name}"? This cannot be undone.`}
							{pendingAction === 'review' && `Move "${selected.name}" to review stage?`}
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={closeConfirm}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={runAction}
								className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
									pendingAction === 'delete'
										? 'bg-rose-600 hover:bg-rose-700'
										: pendingAction === 'publish'
										? 'bg-emerald-600 hover:bg-emerald-700'
										: 'bg-slate-800 hover:bg-slate-900'
								}`}
							>
								Yes, {pendingAction}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default DatasetReleasePage
