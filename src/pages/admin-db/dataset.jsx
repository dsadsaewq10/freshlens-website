import { useMemo, useState } from 'react'

const vegetableDatasets = [
	{ name: 'Tomato Defect Set', records: '12,480', type: 'Classification', source: 'Kaggle', freshness: '89%' },
	{ name: 'Leafy Greens Quality', records: '8,120', type: 'Freshness', source: 'Roboflow', freshness: '93%' },
	{ name: 'Root Vegetable Atlas', records: '16,700', type: 'Detection', source: 'Open Images', freshness: '91%' },
	{ name: 'Pepper Variety Pack', records: '10,340', type: 'Multi-class', source: 'Kaggle', freshness: '87%' },
	{ name: 'Cucumber Surface Dataset', records: '7,610', type: 'Segmentation', source: 'GitHub', freshness: '90%' },
	{ name: 'Eggplant Health Monitor', records: '9,220', type: 'Classification', source: 'OpenML', freshness: '88%' },
]

const datasetAnalytics = {
	freshness: { fresh: 72, notFresh: 28 },
	popularity: [88, 74, 69, 58, 52],
	downloads: [82, 67, 61, 49, 44],
}

const vegetableLabels = ['Tomato', 'Carrot', 'Cabbage', 'Pepper', 'Cucumber']

function DatasetPage() {
	const [datasetSearch, setDatasetSearch] = useState('')
	const [sourceFilter, setSourceFilter] = useState('All')

	const filteredDatasets = useMemo(() => {
		const search = datasetSearch.trim().toLowerCase()
		return vegetableDatasets.filter((dataset) => {
			const bySearch =
				search.length === 0 ||
				dataset.name.toLowerCase().includes(search) ||
				dataset.type.toLowerCase().includes(search)
			const bySource = sourceFilter === 'All' || dataset.source === sourceFilter
			return bySearch && bySource
		})
	}, [datasetSearch, sourceFilter])

	const popularityBars = useMemo(() => {
		const max = Math.max(...datasetAnalytics.popularity)
		return datasetAnalytics.popularity.map((value, index) => ({
			label: vegetableLabels[index],
			height: `${(value / max) * 100}%`,
			value,
		}))
	}, [])

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
							value={sourceFilter}
							onChange={(event) => setSourceFilter(event.target.value)}
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						>
							<option value="All">All sources</option>
							<option value="Kaggle">Kaggle</option>
							<option value="Roboflow">Roboflow</option>
							<option value="Open Images">Open Images</option>
							<option value="GitHub">GitHub</option>
							<option value="OpenML">OpenML</option>
						</select>
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{filteredDatasets.map((dataset) => (
						<article key={dataset.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
							<p className="text-sm font-semibold text-slate-800">{dataset.name}</p>
							<div className="mt-3 space-y-1 text-xs text-slate-600">
								<p>Records: {dataset.records}</p>
								<p>Type: {dataset.type}</p>
								<p>Source: {dataset.source}</p>
								<p>Fresh samples: {dataset.freshness}</p>
							</div>
						</article>
					))}
				</div>
				{filteredDatasets.length === 0 && (
					<p className="pt-6 text-center text-sm text-slate-500">No dataset matches your search/filter.</p>
				)}

				<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
					<article className="flex min-h-80 flex-col rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
						<p className="text-sm font-semibold uppercase tracking-wide text-accent/70">Fresh vs Not Fresh</p>
						<p className="mt-2 text-4xl font-semibold">
							{datasetAnalytics.freshness.fresh}% / {datasetAnalytics.freshness.notFresh}%
						</p>
						<p className="mt-1 text-base text-accent/70">Dataset quality split</p>
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
									strokeDasharray={`${(datasetAnalytics.freshness.fresh / 100) * 390} 390`}
									strokeDashoffset="65"
									strokeLinecap="round"
									transform="rotate(-90 90 90)"
								/>
							</svg>
						</div>
						<div className="mt-2 flex items-center justify-center gap-6 text-sm font-medium">
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-primary" />
								<span className="text-accent/85">Fresh ({datasetAnalytics.freshness.fresh}%)</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="h-3 w-3 rounded-full bg-primary/30" />
								<span className="text-accent/85">Not Fresh ({datasetAnalytics.freshness.notFresh}%)</span>
							</div>
						</div>
					</article>

					<article className="rounded-2xl border border-surface bg-white p-4 text-accent sm:col-span-2 xl:col-span-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-accent/70">Vegetable Popularity</p>
						<p className="mt-2 text-3xl font-semibold">Top dataset categories</p>
						<p className="mt-1 text-sm text-accent/70">Based on access and usage volume</p>
						<div className="mt-4 flex h-40 items-end gap-3">
							{popularityBars.map((item) => (
								<div key={item.label} className="flex flex-1 flex-col items-center gap-2">
									<div className="flex h-full w-full items-end rounded-xl bg-surface p-1">
										<div className="w-full rounded-lg bg-primary" style={{ height: item.height }} />
									</div>
									<p className="text-[11px] font-medium text-accent/70">{item.label}</p>
								</div>
							))}
						</div>
					</article>

					<article className="rounded-2xl bg-primary p-4 text-white sm:col-span-2 xl:col-span-4">
						<p className="text-xs font-semibold uppercase tracking-wide opacity-80">Dataset Download Analytics</p>
						<p className="mt-2 text-3xl font-semibold">1.3k downloads</p>
						<p className="mt-1 text-sm opacity-85">Counts per dataset</p>
						<div className="mt-4 space-y-3">
							{datasetAnalytics.downloads.map((item, index) => (
								<div key={vegetableLabels[index]}>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span>{vegetableLabels[index]}</span>
										<span>{item}%</span>
									</div>
									<div className="h-2 rounded-full bg-white/15">
										<div className="h-2 rounded-full bg-white" style={{ width: `${item}%` }} />
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
