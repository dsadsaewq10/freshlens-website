import { useMemo, useState } from 'react'

// TODO: replace mock data with Supabase query (table: ai_responses)
const initialResponses = [
	{
		id: 'r-001',
		capturedAt: '2026-04-12 09:41',
		user: 'acno',
		vegetable: 'Tomato',
		prompt: 'Is this tomato still usable for salsa?',
		response:
			'Yes. The surface shows minor wrinkling but no mold or soft rot. Safe for cooking within 1–2 days.',
		modelVersion: 'freshlens-chat-0.4.2',
		confidence: 0.86,
		status: 'Pending',
		tags: ['freshness', 'cooking-advice'],
		includeInRetraining: false,
	},
	{
		id: 'r-002',
		capturedAt: '2026-04-12 10:12',
		user: 'jv',
		vegetable: 'Cabbage',
		prompt: 'Why are the outer leaves turning yellow?',
		response:
			'Yellowing outer leaves typically indicate early spoilage from ethylene exposure. Remove the outer layer; inner head is usually fine.',
		modelVersion: 'freshlens-chat-0.4.2',
		confidence: 0.74,
		status: 'Approved',
		tags: ['spoilage', 'storage'],
		includeInRetraining: true,
	},
	{
		id: 'r-003',
		capturedAt: '2026-04-13 08:05',
		user: 'than',
		vegetable: 'Pepper',
		prompt: 'Are the soft spots dangerous?',
		response:
			'Soft spots suggest bruising or mold. Discard if there is visible fuzz or sour smell; otherwise trim the affected area.',
		modelVersion: 'freshlens-chat-0.4.2',
		confidence: 0.62,
		status: 'Needs edit',
		tags: ['mold', 'safety'],
		includeInRetraining: false,
	},
	{
		id: 'r-004',
		capturedAt: '2026-04-13 14:28',
		user: 'pin',
		vegetable: 'Cucumber',
		prompt: 'How long can I keep this in the fridge?',
		response:
			'Wrapped cucumbers last 5–7 days in the crisper drawer. Do not store below 10°C for prolonged periods.',
		modelVersion: 'freshlens-chat-0.4.2',
		confidence: 0.91,
		status: 'Approved',
		tags: ['storage'],
		includeInRetraining: true,
	},
	{
		id: 'r-005',
		capturedAt: '2026-04-14 07:50',
		user: 'acno',
		vegetable: 'Carrot',
		prompt: 'Is the rubbery texture a problem?',
		response:
			'Rubbery carrots have lost moisture. Still safe — rehydrate in ice water for 30 minutes before use.',
		modelVersion: 'freshlens-chat-0.4.2',
		confidence: 0.83,
		status: 'Pending',
		tags: ['texture', 'rescue'],
		includeInRetraining: false,
	},
]

const statusOptions = ['All', 'Pending', 'Approved', 'Needs edit', 'Rejected']

function statusClass(status) {
	if (status === 'Approved') return 'bg-emerald-100 text-emerald-700'
	if (status === 'Pending') return 'bg-amber-100 text-amber-700'
	if (status === 'Needs edit') return 'bg-sky-100 text-sky-700'
	return 'bg-rose-100 text-rose-700'
}

function confidenceClass(value) {
	if (value >= 0.85) return 'text-emerald-700'
	if (value >= 0.7) return 'text-amber-700'
	return 'text-rose-700'
}

function AiResponsePage() {
	const [responses, setResponses] = useState(initialResponses)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('All')
	const [selected, setSelected] = useState(null)
	const [draft, setDraft] = useState(null)
	const [isEditing, setIsEditing] = useState(false)
	const [toast, setToast] = useState('')

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return responses.filter((r) => {
			const byText =
				q.length === 0 ||
				r.prompt.toLowerCase().includes(q) ||
				r.response.toLowerCase().includes(q) ||
				r.vegetable.toLowerCase().includes(q) ||
				r.user.toLowerCase().includes(q)
			const byStatus = statusFilter === 'All' || r.status === statusFilter
			return byText && byStatus
		})
	}, [responses, search, statusFilter])

	const stats = useMemo(() => {
		const total = responses.length
		const approved = responses.filter((r) => r.status === 'Approved').length
		const pending = responses.filter((r) => r.status === 'Pending').length
		const flagged = responses.filter((r) => r.status === 'Needs edit' || r.status === 'Rejected').length
		const retraining = responses.filter((r) => r.includeInRetraining).length
		return { total, approved, pending, flagged, retraining }
	}, [responses])

	function openResponse(entry) {
		setSelected(entry)
		setDraft(entry)
		setIsEditing(false)
	}

	function closeResponse() {
		setSelected(null)
		setDraft(null)
		setIsEditing(false)
	}

	function updateStatus(id, nextStatus) {
		setResponses((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
		if (selected?.id === id) {
			setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev))
			setDraft((prev) => (prev ? { ...prev, status: nextStatus } : prev))
		}
		setToast(`Marked ${id} as ${nextStatus}.`)
	}

	function toggleRetraining(id) {
		setResponses((prev) =>
			prev.map((r) => (r.id === id ? { ...r, includeInRetraining: !r.includeInRetraining } : r)),
		)
	}

	function saveDraft() {
		if (!draft) return
		setResponses((prev) => prev.map((r) => (r.id === draft.id ? { ...draft, status: 'Needs edit' } : r)))
		setSelected(draft)
		setIsEditing(false)
		setToast(`Response ${draft.id} edited and re-queued for review.`)
	}

	function exportRetrainingBatch() {
		const batch = responses.filter((r) => r.includeInRetraining && r.status === 'Approved')
		// TODO: POST batch to /retraining endpoint or upload JSONL to Supabase Storage
		console.log('retraining batch (stub)', batch)
		setToast(`Queued ${batch.length} approved response(s) for retraining export.`)
	}

	return (
		<>
			<section className="space-y-5">
				<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
					<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
						<div>
							<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">AI response review</h1>
							<p className="mt-1 text-sm text-slate-500">
								Review chatbot answers paired with user captures. Approve, edit, or flag — approved items can
								be exported for retraining the on-device chat model.
							</p>
						</div>
						<button
							type="button"
							onClick={exportRetrainingBatch}
							className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
						>
							Export retraining batch
						</button>
					</div>

					<div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
						{[
							{ label: 'Total responses', value: stats.total },
							{ label: 'Approved', value: stats.approved },
							{ label: 'Pending', value: stats.pending },
							{ label: 'Flagged', value: stats.flagged },
							{ label: 'In retraining set', value: stats.retraining },
						].map((card) => (
							<div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
								<p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
							</div>
						))}
					</div>

					<div className="mb-4 flex w-full flex-wrap gap-2">
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search prompt, response, user, or vegetable"
							className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						/>
						<select
							value={statusFilter}
							onChange={(event) => setStatusFilter(event.target.value)}
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						>
							{statusOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-3">
						{filtered.map((entry) => (
							<article
								key={entry.id}
								className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-primary/40"
							>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-mono text-slate-500">{entry.id}</span>
											<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(entry.status)}`}>
												{entry.status}
											</span>
											<span className="rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
												{entry.vegetable}
											</span>
											<span className={`text-xs font-semibold ${confidenceClass(entry.confidence)}`}>
												{(entry.confidence * 100).toFixed(0)}% conf
											</span>
										</div>
										<p className="mt-2 text-sm font-medium text-slate-900">“{entry.prompt}”</p>
										<p className="mt-1 line-clamp-2 text-xs text-slate-600">{entry.response}</p>
										<p className="mt-2 text-[11px] text-slate-500">
											by {entry.user} · {entry.capturedAt} · {entry.modelVersion}
										</p>
									</div>
									<div className="flex flex-col items-end gap-2">
										<label className="flex items-center gap-2 text-xs text-slate-600">
											<input
												type="checkbox"
												checked={entry.includeInRetraining}
												onChange={() => toggleRetraining(entry.id)}
											/>
											Retrain
										</label>
										<div className="flex flex-wrap justify-end gap-2">
											<button
												type="button"
												onClick={() => openResponse(entry)}
												className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
											>
												Review
											</button>
											<button
												type="button"
												onClick={() => updateStatus(entry.id, 'Approved')}
												className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
											>
												Approve
											</button>
											<button
												type="button"
												onClick={() => updateStatus(entry.id, 'Rejected')}
												className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
											>
												Reject
											</button>
										</div>
									</div>
								</div>
							</article>
						))}
						{filtered.length === 0 && (
							<p className="pt-6 text-center text-sm text-slate-500">No responses match the current filter.</p>
						)}
					</div>

					{toast && (
						<p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs font-medium text-emerald-700">
							{toast}
						</p>
					)}
				</div>
			</section>

			{selected && draft && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<div className="mb-4 flex items-start justify-between gap-2">
							<div>
								<h2 className="text-xl font-semibold text-slate-900">Response {selected.id}</h2>
								<p className="text-sm text-slate-500">
									{selected.vegetable} · by {selected.user} · {selected.capturedAt}
								</p>
							</div>
							<button
								type="button"
								onClick={closeResponse}
								className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
							>
								Close
							</button>
						</div>

						<div className="space-y-3">
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">User prompt</span>
								<textarea
									value={draft.prompt}
									readOnly={!isEditing}
									onChange={(event) => setDraft({ ...draft, prompt: event.target.value })}
									rows={2}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">AI response</span>
								<textarea
									value={draft.response}
									readOnly={!isEditing}
									onChange={(event) => setDraft({ ...draft, response: event.target.value })}
									rows={5}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="rounded-xl bg-slate-50 p-3">
									<p className="text-[11px] uppercase text-slate-500">Confidence</p>
									<p className={`mt-1 font-semibold ${confidenceClass(selected.confidence)}`}>
										{(selected.confidence * 100).toFixed(0)}%
									</p>
								</div>
								<div className="rounded-xl bg-slate-50 p-3">
									<p className="text-[11px] uppercase text-slate-500">Model</p>
									<p className="mt-1 text-sm font-medium text-slate-700">{selected.modelVersion}</p>
								</div>
								<div className="rounded-xl bg-slate-50 p-3">
									<p className="text-[11px] uppercase text-slate-500">Tags</p>
									<p className="mt-1 text-sm font-medium text-slate-700">{selected.tags.join(', ')}</p>
								</div>
							</div>
						</div>

						<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
							<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(selected.status)}`}>
								{selected.status}
							</span>
							<div className="flex flex-wrap gap-2">
								{isEditing ? (
									<>
										<button
											type="button"
											onClick={saveDraft}
											className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
										>
											Save edits
										</button>
										<button
											type="button"
											onClick={() => {
												setDraft(selected)
												setIsEditing(false)
											}}
											className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
										>
											Cancel
										</button>
									</>
								) : (
									<button
										type="button"
										onClick={() => setIsEditing(true)}
										className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
									>
										Edit
									</button>
								)}
								<button
									type="button"
									onClick={() => updateStatus(selected.id, 'Approved')}
									className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
								>
									Approve
								</button>
								<button
									type="button"
									onClick={() => updateStatus(selected.id, 'Rejected')}
									className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
								>
									Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default AiResponsePage
