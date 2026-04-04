import { useMemo, useState } from 'react'

const initialUsers = [
	{
		id: 1,
		username: 'dsadsa',
		name: 'pin',
		email: 'pin@gmail.com',
		password: 'pin#1284',
		role: 'Admin',
		status: 'Active',
		lastSeen: '2 mins ago',
	},
	{
		id: 2,
		username: 'ewq',
		name: 'than',
		email: 'dsa1@yahoo.com',
		password: 'than#1234',
		role: 'Admin',
		status: 'Active',
		lastSeen: '15 mins ago',
	},
	{
		id: 3,
		username: 'acno',
		name: 'bornacnocoding',
		email: 'acnocoding@gmail.com',
		password: 'bornacnocoding',
		role: 'User',
		status: 'Active',
		lastSeen: '1 hour ago',
	},
	{
		id: 4,
		username: 'jv',
		name: 'janev',
		email: 'jvetivac@gmail.com',
		password: 'jv#1234',
		role: 'User',
		status: 'Deactivated',
		lastSeen: 'Yesterday',
	},
]

function statusClass(status) {
	if (status === 'Active') {
		return 'bg-emerald-100 text-emerald-700'
	}
	if (status === 'Pending') {
		return 'bg-amber-100 text-amber-700'
	}
	return 'bg-rose-100 text-rose-700'
}

function UserPage() {
	const [users, setUsers] = useState(initialUsers)
	const [userSearch, setUserSearch] = useState('')
	const [roleFilter, setRoleFilter] = useState('All')
	const [selectedUser, setSelectedUser] = useState(null)
	const [userToDelete, setUserToDelete] = useState(null)
	const [statusToConfirm, setStatusToConfirm] = useState(null)
	const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
	const [modalForm, setModalForm] = useState(null)
	const [isEditing, setIsEditing] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [updateLogs, setUpdateLogs] = useState([])

	const filteredUsers = useMemo(() => {
		const search = userSearch.trim().toLowerCase()
		return users.filter((user) => {
			const bySearch =
				search.length === 0 ||
				user.username.toLowerCase().includes(search) ||
				user.name.toLowerCase().includes(search) ||
				user.email.toLowerCase().includes(search)
			const byRole = roleFilter === 'All' || user.role === roleFilter
			return bySearch && byRole
		})
	}, [users, userSearch, roleFilter])

	function openUserModal(user) {
		setSelectedUser(user)
		setModalForm(user)
		setIsEditing(false)
	}

	function closeUserModal() {
		setSelectedUser(null)
		setModalForm(null)
		setIsEditing(false)
		setStatusToConfirm(null)
		setIsSaveConfirmOpen(false)
	}

	function updateUserStatusById(userId, nextStatus) {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId
					? {
						...user,
						status: nextStatus,
					}
					: user,
			),
		)
	}

	function updateAccountStatus(nextStatus) {
		if (!selectedUser) {
			return
		}

		updateUserStatusById(selectedUser.id, nextStatus)

		setSelectedUser((prevSelectedUser) => {
			if (!prevSelectedUser) {
				return null
			}
			return {
				...prevSelectedUser,
				status: nextStatus,
			}
		})

		setModalForm((prevForm) => {
			if (!prevForm) {
				return null
			}
			return {
				...prevForm,
				status: nextStatus,
			}
		})
	}

	function openStatusConfirm(nextStatus) {
		if (!selectedUser) {
			return
		}
		setStatusToConfirm(nextStatus)
	}

	function closeStatusConfirm() {
		setStatusToConfirm(null)
	}

	function confirmStatusChange() {
		if (!statusToConfirm || !selectedUser) {
			return
		}

		updateAccountStatus(statusToConfirm)
		setSuccessMessage(`Account status updated to ${statusToConfirm}.`)
		setStatusToConfirm(null)
	}

	function handleModalInputChange(field, value) {
		setModalForm((prevForm) => {
			if (!prevForm) {
				return null
			}
			return {
				...prevForm,
				[field]: value,
			}
		})
	}

	function confirmSaveEdit() {
		if (!selectedUser || !modalForm) {
			return
		}

		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === selectedUser.id
					? {
						...user,
						username: modalForm.username,
						email: modalForm.email,
						password: modalForm.password,
					}
					: user,
			),
		)

		setSelectedUser({
			...selectedUser,
			username: modalForm.username,
			email: modalForm.email,
			password: modalForm.password,
		})

		setUpdateLogs((prevLogs) => [
			{
				id: Date.now(),
				message: `Updated ${selectedUser.name}: ${modalForm.username} / ${modalForm.email}`,
			},
			...prevLogs,
		])
		setSuccessMessage('User profile updated successfully.')
		setIsEditing(false)
		setIsSaveConfirmOpen(false)
	}

	function handleEditOrSave() {
		if (!selectedUser || !modalForm) {
			return
		}

		if (!isEditing) {
			setIsEditing(true)
			return
		}

		setIsSaveConfirmOpen(true)
	}

	function closeSaveConfirm() {
		setIsSaveConfirmOpen(false)
	}

	function handleCancelEdit() {
		if (!selectedUser) {
			return
		}

		setModalForm(selectedUser)
		setSuccessMessage('')
		setIsEditing(false)
		setIsSaveConfirmOpen(false)
	}

	function openDeleteConfirm(user) {
		setStatusToConfirm(null)
		setIsSaveConfirmOpen(false)
		setUserToDelete(user)
	}

	function closeDeleteConfirm() {
		setUserToDelete(null)
	}

	function confirmDeleteUser() {
		if (!userToDelete) {
			return
		}

		setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id))
		setUpdateLogs((prevLogs) => [
			{
				id: Date.now(),
				message: `Deleted account: ${userToDelete.username} / ${userToDelete.email}`,
			},
			...prevLogs,
		])

		if (selectedUser && selectedUser.id === userToDelete.id) {
			closeUserModal()
		}

		setStatusToConfirm(null)
		setIsSaveConfirmOpen(false)
		setUserToDelete(null)
	}

	return (
		<>
			<section className="space-y-5">
			<div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">User management</h1>
					<div className="flex w-full flex-wrap gap-2 sm:w-auto">
						<input
							type="search"
							value={userSearch}
							onChange={(event) => setUserSearch(event.target.value)}
							placeholder="Search name or email"
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						/>
						<select
							value={roleFilter}
							onChange={(event) => setRoleFilter(event.target.value)}
							className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-cyan-400 sm:w-auto"
						>
							<option value="All">All roles</option>
							<option value="Admin">Admin</option>
							<option value="Reviewer">Reviewer</option>
							<option value="Analyst">Analyst</option>
						</select>
					</div>
				</div>

				<div className="space-y-3 md:hidden">
					{filteredUsers.map((user) => (
						<article key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-sm font-semibold text-slate-900">{user.username}</p>
									<p className="text-xs text-slate-600">{user.email}</p>
								</div>
								<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(user.status)}`}>
									{user.status}
								</span>
							</div>
							<div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
								<p>
									<span className="font-medium text-slate-700">Role:</span> {user.role}
								</p>
								<p>
									<span className="font-medium text-slate-700">Last seen:</span> {user.lastSeen}
								</p>
							</div>
							<div className="mt-4 flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => openUserModal(user)}
									className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
								>
									View profile
								</button>
								<button
									type="button"
									onClick={() => openDeleteConfirm(user)}
									className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
								>
									Delete
								</button>
							</div>
						</article>
					))}
				</div>

				<div className="hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-slate-100 text-xs uppercase text-slate-600">
							<tr>
								<th className="px-4 py-3">Username</th>
								<th className="px-4 py-3">Email</th>
								<th className="px-4 py-3">Role</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Last seen</th>
								<th className="px-4 py-3">Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50/80">
									<td className="px-4 py-3 font-medium">{user.username}</td>
									<td className="px-4 py-3 text-slate-600">{user.email}</td>
									<td className="px-4 py-3">{user.role}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(user.status)}`}>
											{user.status}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-600">{user.lastSeen}</td>
									<td className="px-4 py-3">
										<div className="flex flex-wrap gap-2">
											<button
												type="button"
												onClick={() => openUserModal(user)}
												className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
											>
												View profile
											</button>
											<button
												type="button"
												onClick={() => openDeleteConfirm(user)}
												className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filteredUsers.length === 0 && (
					<p className="pt-6 text-center text-sm text-slate-500">No users found for the current filter.</p>
				)}

				{updateLogs.length > 0 && (
					<div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
						<p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recent profile updates</p>
						<ul className="mt-2 space-y-1 text-xs text-emerald-800">
							{updateLogs.slice(0, 5).map((log) => (
								<li key={log.id}>{log.message}</li>
							))}
						</ul>
					</div>
				)}
			</div>
			</section>

			{selectedUser && modalForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<div className="mb-5 flex items-start justify-between gap-2">
							<div>
								<h2 className="text-xl font-semibold text-slate-900">User information</h2>
								<p className="text-sm text-slate-500">Manage account status and review credentials</p>
							</div>
							<button
								type="button"
								onClick={closeUserModal}
								className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
							>
								Close
							</button>
						</div>

						<div className="space-y-3">
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Username</span>
								<input
									type="text"
									value={modalForm.username}
									onChange={(event) => handleModalInputChange('username', event.target.value)}
									readOnly={!isEditing}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Email</span>
								<input
									type="email"
									value={modalForm.email}
									onChange={(event) => handleModalInputChange('email', event.target.value)}
									readOnly={!isEditing}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
							<label className="block text-sm">
								<span className="mb-1 block text-slate-500">Password</span>
								<input
									type="text"
									value={modalForm.password}
									onChange={(event) => handleModalInputChange('password', event.target.value)}
									readOnly={!isEditing}
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
								/>
							</label>
						</div>

						<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
							<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(modalForm.status)}`}>
								{modalForm.status}
							</span>
							{successMessage && <p className="text-xs font-medium text-emerald-700">{successMessage}</p>}
							<div className="flex w-full flex-wrap gap-2 sm:w-auto">
								<button
									type="button"
									onClick={handleEditOrSave}
									className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
								>
									{isEditing ? 'Save' : 'Edit'}
								</button>
								{isEditing && (
									<button
										type="button"
										onClick={handleCancelEdit}
										className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
									>
										Cancel
									</button>
								)}
								<button
									type="button"
									onClick={() => openStatusConfirm('Active')}
									className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
								>
									Activate
								</button>
								<button
									type="button"
									onClick={() => openStatusConfirm('Deactivated')}
									className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
								>
									Deactivate
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{statusToConfirm && selectedUser && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<h2 className="text-lg font-semibold text-slate-900">Confirm account status change</h2>
						<p className="mt-2 text-sm text-slate-600">
							Are you sure you want to set <span className="font-semibold">{selectedUser.username}</span> to{' '}
							<span className="font-semibold">{statusToConfirm}</span>?
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={closeStatusConfirm}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={confirmStatusChange}
								className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
									statusToConfirm === 'Active' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
								}`}
							>
								Yes, confirm
							</button>
						</div>
					</div>
				</div>
			)}

			{isSaveConfirmOpen && selectedUser && modalForm && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<h2 className="text-lg font-semibold text-slate-900">Confirm profile update</h2>
						<p className="mt-2 text-sm text-slate-600">
							Save changes for <span className="font-semibold">{selectedUser.username}</span>?
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={closeSaveConfirm}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={confirmSaveEdit}
								className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
							>
								Yes, save
							</button>
						</div>
					</div>
				</div>
			)}

			{userToDelete && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4">
					<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
						<h2 className="text-lg font-semibold text-slate-900">Confirm account deletion</h2>
						<p className="mt-2 text-sm text-slate-600">
							Are you sure you want to delete <span className="font-semibold">{userToDelete.username}</span>? This action cannot be undone.
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={closeDeleteConfirm}
								className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={confirmDeleteUser}
								className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
							>
								Yes, delete
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default UserPage
