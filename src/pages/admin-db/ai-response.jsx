import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

const statusOptions = ['Pending', 'Approved', 'Needs edit', 'Rejected', 'All']
const REVIEW_STORAGE_KEY = 'freshlens.aiResponseReviews.v1'

function statusClass(status) {
	if (status === 'Approved') return 'bg-emerald-100 text-emerald-700'
	if (status === 'Pending') return 'bg-amber-100 text-amber-700'
	if (status === 'Needs edit') return 'bg-sky-100 text-sky-700'
	return 'bg-rose-100 text-rose-700'
}

function formatTimestamp(iso) {
	if (!iso) return '—'
	try {
		const d = new Date(iso)
		return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`
	} catch {
		return iso
	}
}

// Walk messages[] jsonb and build (user → assistant) pairs.
function extractPairs(session) {
	const msgs = Array.isArray(session.messages) ? session.messages : []
	const pairs = []
	for (let i = 0; i < msgs.length; i++) {
		const m = msgs[i]
		if (!m || !m.isUser) continue
		// find next assistant reply
		let j = i + 1
		while (j < msgs.length && msgs[j]?.isUser) j++
		const reply = msgs[j]
		if (!reply || reply.isUser) continue
		const id = `${session.local_id || session.id}::${m.id ?? i}`
		pairs.push({
			id,
			sessionId: session.local_id || session.id,
			sessionTitle: session.title || 'Chat',
			capturedAt: m.timestamp || session.last_message_at,
			user: (session.user_id ?? '').slice(0, 8) || 'user',
			prompt: String(m.text ?? '').trim(),
			response: String(reply.text ?? '').trim(),
			provider: reply.provider ?? 'unknown',
		})
	}
	return pairs
}

function loadReviews() {
	try {
		const raw = localStorage.getItem(REVIEW_STORAGE_KEY)
		return raw ? JSON.parse(raw) : {}
	} catch {
		return {}
	}
}

function saveReviews(reviews) {
	try {
		localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews))
	} catch { /* storage unavailable */ }
}

function AiResponsePage() {
	const [rawPairs, setRawPairs] = useState([])
	const [loading, setLoading] = useState(true)
	const [reviews, setReviews] = useState(() => loadReviews())
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('Pending')
	const [selected, setSelected] = useState(null)
	const [draft, setDraft] = useState(null)
	const [isEditing, setIsEditing] = useState(false)
	const [toast, setToast] = useState('')

	useEffect(() => {
		(async () => {
			const { data, error } = await supabase
				.from('chat_sessions')
				.select('local_id, user_id, title, messages, last_message_at, created_at')
				.order('last_message_at', { ascending: false })
				.limit(500)
			if (error) {
				setToast(`Failed to load chat sessions: ${error.message}`)
				setLoading(false)
				return
			}
			const all = []
			for (const s of data ?? []) all.push(...extractPairs(s))
			setRawPairs(all)
			setLoading(false)
		})()
	}, [])

	// Merge raw pairs with per-id review metadata from localStorage
	const responses = useMemo(() => rawPairs.map((p) => {
		const r = reviews[p.id] || {}
		return {
			...p,
			prompt: r.prompt ?? p.prompt,
			response: r.response ?? p.response,
			status: r.status ?? 'Pending',
		}
	}), [rawPairs, reviews])

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return responses.filter((r) => {
			const byText =
				q.length === 0 ||
				r.prompt.toLowerCase().includes(q) ||
				r.response.toLowerCase().includes(q) ||
				r.user.toLowerCase().includes(q) ||
				r.sessionTitle.toLowerCase().includes(q)
			const byStatus = statusFilter === 'All' || r.status === statusFilter
			return byText && byStatus
		})
	}, [responses, search, statusFilter])

	const stats = useMemo(() => {
		const total = responses.length
		const approved = responses.filter((r) => r.status === 'Approved').length
		const pending = responses.filter((r) => r.status === 'Pending').length
		const flagged = responses.filter((r) => r.status === 'Needs edit' || r.status === 'Rejected').length
		return { total, approved, pending, flagged }
	}, [responses])

	function patchReview(id, patch) {
		setReviews((prev) => {
			const next = { ...prev, [id]: { ...(prev[id] || {}), ...patch } }
			saveReviews(next)
			return next
		})
	}

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
		patchReview(id, { status: nextStatus })
		if (selected?.id === id) {
			setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev))
			setDraft((prev) => (prev ? { ...prev, status: nextStatus } : prev))
		}
		setToast(`Marked response as ${nextStatus}.`)
	}

	function saveDraft() {
		if (!draft) return
		patchReview(draft.id, {
			prompt: draft.prompt,
			response: draft.response,
			status: 'Needs edit',
		})
		setSelected({ ...draft, status: 'Needs edit' })
		setIsEditing(false)
		setToast('Response edited and re-queued for review.')
	}

	function exportRetrainingBatch() {
		const batch = responses.filter((r) => r.status === 'Approved')
		if (batch.length === 0) {
			setToast('Nothing to export — approve responses first.')
			return
		}
		const cleanResponse = (text) => String(text ?? '')
			.replace(/\*\*/g, '')
			.replace(/#{1,6}\s*/g, '')
			.trim()
		// JSONL: one row per pair, ready for supervised fine-tuning
		const lines = batch.map((r) => JSON.stringify({
			instruction: r.prompt,
			response: cleanResponse(r.response),
		}))
		const blob = new Blob([lines.join('\n') + '\n'], { type: 'application/jsonl' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `freshlens_chat_retraining_${new Date().toISOString().slice(0, 10)}.jsonl`
		document.body.appendChild(a); a.click(); document.body.removeChild(a)
		URL.revokeObjectURL(url)
		setToast(`Exported ${batch.length} approved response(s) as JSONL.`)
	}

	return (
		<>
			<section className="space-y-5">
				<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
					<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
						<div>
							<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">AI response review</h1>
							<p className="mt-1 text-sm text-slate-500">
								Review chatbot answers paired with user captures. Approve, edit, or flag — all approved items
								are exported as a JSONL for retraining the on-device chat model.
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

					<div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						{[
							{ label: 'Total responses', value: stats.total },
							{ label: 'Approved', value: stats.approved },
							{ label: 'Pending', value: stats.pending },
							{ label: 'Flagged', value: stats.flagged },
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
							placeholder="Search prompt, response, user, or session"
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
						{loading && (
							<p className="pt-6 text-center text-sm text-slate-500">Loading chat sessions…</p>
						)}
						{!loading && filtered.map((entry) => (
							<article
								key={entry.id}
								className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-primary/40"
							>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-mono text-slate-500 truncate max-w-65">{entry.sessionTitle}</span>
											<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(entry.status)}`}>
												{entry.status}
											</span>
											<span className="rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700">
												{entry.provider}
											</span>
										</div>
										<p className="mt-2 text-sm font-medium text-slate-900">“{entry.prompt}”</p>
										<p className="mt-1 line-clamp-2 text-xs text-slate-600">{entry.response}</p>
										<p className="mt-2 text-[11px] text-slate-500">
											by {entry.user} · {formatTimestamp(entry.capturedAt)}
										</p>
									</div>
									<div className="flex flex-col items-end gap-2">
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
						{!loading && filtered.length === 0 && (
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
								<h2 className="text-xl font-semibold text-slate-900 truncate max-w-95">{selected.sessionTitle}</h2>
								<p className="text-sm text-slate-500">
									by {selected.user} · {formatTimestamp(selected.capturedAt)} · {selected.provider}
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
									rows={6}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
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
