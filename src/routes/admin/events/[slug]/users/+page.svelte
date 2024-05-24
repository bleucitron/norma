<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Level, Role, State } from '$lib/types/norma.js';
	import type { Database } from '../../../../../types/supabase';
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';

	export let data;
	let users = data.users;
	let eventName = data.eventName;

	type Dancer = Database['public']['Tables']['dancers']['Row'];

	let searchTerm = '';
	let roleFilter: Role | undefined;
	let stateFilter: State | undefined;
	let levelFilter: Level | undefined;
	let sortColumn = '';
	let sortOrder = 1;
	let sortedUsers = users.slice();

	$: filteredUsers = sortedUsers.filter((user) => {
		const trimmedSearchTerm = searchTerm.trim().toLowerCase();
		const trimmedFullName = `${user.firstname} ${user.lastname}`.toLowerCase();

		const isSearchMatch =
			trimmedSearchTerm === '' ||
			trimmedFullName.includes(trimmedSearchTerm) ||
			user.email.toLowerCase().includes(trimmedSearchTerm);

		const isNameMatch =
			(user.lastname && user.lastname.toLowerCase().includes(trimmedSearchTerm)) ||
			(user.firstname && user.firstname.toLowerCase().includes(trimmedSearchTerm));

		const isCombinedNameMatch =
			trimmedSearchTerm.includes(' ') &&
			user.lastname &&
			user.firstname &&
			(user.lastname.toLowerCase() + ' ' + user.firstname.toLowerCase()).includes(
				trimmedSearchTerm
			);

		const isCombinedReverseNameMatch =
			trimmedSearchTerm.includes(' ') &&
			user.firstname &&
			user.lastname &&
			(user.firstname.toLowerCase() + ' ' + user.lastname.toLowerCase()).includes(
				trimmedSearchTerm
			);

		const isRoleMatch = roleFilter === undefined || user.role === roleFilter;
		const isStateMatch = stateFilter === undefined || user.state === stateFilter;
		const isLevelMatch = levelFilter === undefined || user.level === levelFilter;

		return (
			(isSearchMatch || isNameMatch || isCombinedNameMatch || isCombinedReverseNameMatch) &&
			isRoleMatch &&
			isStateMatch &&
			isLevelMatch
		);
	});

	$: numberOfFilteredUsers = filteredUsers.length;

	function toggleSort(column: string) {
		if (column === sortColumn) {
			sortOrder *= -1;
		} else {
			sortOrder = 1;
			sortColumn = column;
		}

		if (column === 'created_at' || column === 'updated_at') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const dateA = column === 'created_at' ? a.created_at : a.updated_at;
				const dateB = column === 'created_at' ? b.created_at : b.updated_at;
				const difference = new Date(dateA).getTime() - new Date(dateB).getTime();
				return sortOrder * difference;
			});
		} else if (column === 'pass') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = a.pass_name ? a.pass_name.toLowerCase() : '';
				const valueB = b.pass_name ? b.pass_name.toLowerCase() : '';
				return sortOrder * valueA.localeCompare(valueB);
			});
		} else if (column === 'level') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = a.level;
				const valueB = b.level;
				if (valueA === valueB) {
					return 0;
				} else if (valueA === Level.Débutant) {
					return sortOrder;
				} else if (valueB === Level.Débutant) {
					return -sortOrder;
				} else if (valueA === Level.Confirmé && valueB === Level.Expert) {
					return sortOrder;
				} else if (valueA === Level.Expert && valueB === Level.Confirmé) {
					return -sortOrder;
				} else {
					return 0;
				}
			});
		} else if (column === 'email') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const emailA = a.email.toLowerCase();
				const emailB = b.email.toLowerCase();
				return sortOrder * emailA.localeCompare(emailB);
			});
		} else if (column === 'firstname' || column === 'lastname') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = (a[column] || '').toLowerCase();
				const valueB = (b[column] || '').toLowerCase();
				return sortOrder * valueA.localeCompare(valueB);
			});
		} else {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = column === 'role' ? a.role : a.state;
				const valueB = column === 'role' ? b.role : b.state;
				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortOrder * (valueA - valueB);
				} else {
					return 0;
				}
			});
		}
	}

	function resetState() {
		searchTerm = '';
		roleFilter = undefined;
		stateFilter = undefined;
		levelFilter = undefined;
		sortColumn = '';
		sortOrder = 1;
		sortedUsers = users.slice();
	}

	function formatToFrenchDate(dateString: string) {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	async function deleteUser(userToDelete: Dancer) {
		try {
			const response = await fetch(`/admin/events/${eventName}/users/${userToDelete.id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				invalidate('/admin/events/${eventName}/users/').then(() => {
					location.reload();
				});
			} else {
				alert("Erreur lors de la suppression de l'utilisateur");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression de l'utilisateur", error);
			alert("Erreur lors de la suppression de l'utilisateur");
		}
	}
	function openUpdate(user: Dancer) {
		let updatePopup = document.querySelector(
			`.update__container[data-user-id="${user.id}"]`
		) as HTMLElement | null;

		if (updatePopup) {
			updatePopup.style.display = 'flex';

			const firstnameInput = updatePopup.querySelector<HTMLInputElement>('[name="firstname"]');
			if (firstnameInput) firstnameInput.value = user.firstname ?? '';

			const lastnameInput = updatePopup.querySelector<HTMLInputElement>('[name="lastname"]');
			if (lastnameInput) lastnameInput.value = user.lastname ?? '';

			const roleInput = updatePopup.querySelector<HTMLInputElement>('[name="role"]');
			if (roleInput) roleInput.value = user.role?.toString() ?? '';

			const stateInput = updatePopup.querySelector<HTMLInputElement>('[name="state"]');
			if (stateInput) stateInput.value = user.state?.toString() ?? '';

			const partnerInput = updatePopup.querySelector<HTMLInputElement>('[name="partner"]');
			if (partnerInput) partnerInput.value = user.partner_id?.toString() ?? '';
		}
	}

	function closeUpdate(userId: number) {
		let updatePopup = document.querySelector(
			`.update__container[data-user-id="${userId}"]`
		) as HTMLElement | null;

		if (updatePopup) {
			updatePopup.style.display = 'none';
		}
	}

	function openDelete(user: Dancer) {
		let deleteModal = document.querySelector(
			`.delete__modal[data-user-id="${user.id}"]`
		) as HTMLElement | null;

		if (deleteModal) {
			deleteModal.style.display = 'flex';
		}
	}

	function closeDelete(userId: number) {
		let deleteModal = document.querySelector(
			`.delete__modal[data-user-id="${userId}"]`
		) as HTMLElement | null;

		if (deleteModal) {
			deleteModal.style.display = 'none';
		}
	}

	async function updateUser(userToUpdate: Dancer) {
		const form = document.querySelector(
			`.update__container[data-user-id="${userToUpdate.id}"] form`
		);
		//@ts-expect-error Form to handle
		const formData = new FormData(form);
		const userData = Object.fromEntries(formData.entries());
		try {
			const response = await fetch(`/admin/events/${eventName}/users/${userToUpdate.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (response.ok) {
				invalidate('/admin/events/${eventName}/users/').then(() => {
					location.reload();
				});
			} else {
				alert("Erreur lors de la modification de l'utilisateur");
			}
		} catch (error) {
			console.error("Erreur lors de la modification de l'utilisateur", error);
			alert("Erreur lors de la modification de l'utilisateur");
		}
	}
	function mapRole(role: Role) {
		switch (role) {
			case Role.Leader:
				return 'Leader';
			case Role.Suiveur:
				return 'Suiveur';
			default:
				const exhaustiveCheck: never = role;
				throw new Error(`Unhandled role: ${exhaustiveCheck}`);
		}
	}
	function mapLevel(level: Level) {
		switch (level) {
			case Level.Débutant:
				return 'Débutant';
			case Level.Confirmé:
				return 'Confirmé';
			case Level.Expert:
				return 'Expert';
			default:
				const exhaustiveCheck: never = level;
				throw new Error(`Unhandled role: ${exhaustiveCheck}`);
		}
	}

	function mapState(state: State) {
		switch (state) {
			case State.Attente:
				return "Liste d'attente";
			case State['Règlement en cours']:
				return 'En attente de paiement';
			case State.Inscrit:
				return 'Inscrit';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}

	function closeModal(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (
			target.classList.contains('update__container') ||
			target.classList.contains('delete__modal')
		) {
			target.style.display = 'none';
		}
	}
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

<section class="users__container">
	<div class="wrapper__return">
		<div>
			<h1>Listes des participants</h1>
			{#if numberOfFilteredUsers === 1}
				<p>Il y a {numberOfFilteredUsers} participant trouvé</p>
			{:else if numberOfFilteredUsers > 1}
				<p>Il y a {numberOfFilteredUsers} participants trouvés</p>
			{:else}
				<p>Aucun participant trouvé</p>
			{/if}
		</div>
		<div>
			<a href="/admin" class="btn">Retour</a>
		</div>
	</div>

	<div class="filters__container">
		<div class="search__container">
			<span class="search-icon">🔍</span>
			<input type="text" bind:value={searchTerm} placeholder="Rechercher un participant" />
		</div>
		<button class="reset__btn" on:click={resetState}>Réinitialiser</button>
	</div>

	<div class="filters__container__column">
		<div>
			<p>Filtrer par :</p>
		</div>
		<div class="filters__container">
			<select bind:value={roleFilter}>
				<option value={undefined}>--Choisir le rôle--</option>
				<option value={Role.Leader}>Leader</option>
				<option value={Role.Suiveur}>Suiveur</option>
			</select>
			<select bind:value={stateFilter}>
				<option value={undefined}>--Choisir l'état--</option>
				<option value={State.Inscrit}>Inscrit</option>
				<option value={State.Attente}>En attente</option>
				<option value={State['Règlement en cours']}>Reglement en cours</option>
			</select>
			<select bind:value={levelFilter}>
				<option value={undefined}>--Choisir le niveau--</option>
				<option value={Level.Débutant}>Débutant</option>
				<option value={Level.Confirmé}>Confirmé</option>
				<option value={Level.Expert}>Expert</option>
			</select>
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th on:click={() => toggleSort('lastname')}>
					Nom
					<span class:desc={sortOrder === -1 && sortColumn === 'lastname'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('firstname')}>
					Prénom
					<span class:desc={sortOrder === -1 && sortColumn === 'firstname'} class="sort-icon"
					></span>
				</th>
				<th on:click={() => toggleSort('email')}>
					Email
					<span class:desc={sortOrder === -1 && sortColumn === 'email'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('role')}>
					Rôle
					<span class:desc={sortOrder === -1 && sortColumn === 'role'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('level')}>
					Niveau
					<span class:desc={sortOrder === -1 && sortColumn === 'level'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('state')}>
					État
					<span class:desc={sortOrder === -1 && sortColumn === 'state'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('created_at')}>
					Inscrit le
					<span class:desc={sortOrder === -1 && sortColumn === 'created_at'} class="sort-icon"
					></span>
				</th>
				<th on:click={() => toggleSort('pass_name')}>
					Pass
					<span class:desc={sortOrder === -1 && sortColumn === 'pass_name'} class="sort-icon"
					></span>
				</th>
				<th on:click={() => toggleSort('updated_at')}>
					Dernière modification
					<span class:desc={sortOrder === -1 && sortColumn === 'updated_at'} class="sort-icon"
					></span>
				</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if numberOfFilteredUsers === 0}
				<tr>
					<td class="no__users" colspan="1">Aucun utilisateur trouvé</td>
				</tr>
			{:else}
				{#each filteredUsers as user}
					<tr>
						<td>{user.lastname ? user.lastname : '-'}</td>
						<td>{user.firstname ? user.firstname : '-'}</td>
						<td>{user.email}</td>
						<td>{mapRole(user.role)}</td>
						<td>{mapLevel(user.level)}</td>
						<td>{mapState(user.state)}</td>
						<td>{formatToFrenchDate(user.created_at)}</td>
						<td>{user.pass_name ? user.pass_name : '-'}</td>
						<td>{user.updated_at ? formatToFrenchDate(user.updated_at) : '-'}</td>
						<td class="updateBtn">
							<button class="btn" on:click={() => openUpdate(user)}>Modifier</button>
							<button class="btn" on:click={() => openDelete(user)}>Supprimer</button>
						</td>
					</tr>
					<div
						class="delete__modal"
						data-user-id={user.id}
						on:click={closeModal}
						aria-hidden="true"
					>
						<div class="delete__container__in">
							<p>
								<strong>
									Voulez vous vraiment supprimer ? {#if user.firstname && user.lastname}
										{user.firstname} {user.lastname}
									{:else}
										{user.email}
									{/if}</strong
								>
							</p>
							<div>
								<button class="btn" on:click={() => deleteUser(user)}>Supprimer</button>
								<button class="btn" on:click={() => closeDelete(user.id)}>Annuler</button>
							</div>
						</div>
					</div>
					<div
						class="update__container"
						data-user-id={user.id}
						on:click={closeModal}
						aria-hidden="true"
					>
						<div class="update__container__in">
							<div class="update__header">
								<p>
									<strong>
										Mettre à jour {#if user.firstname && user.lastname}
											{user.firstname} {user.lastname}
										{:else}
											{user.email}
										{/if}</strong
									>
								</p>
							</div>
							<form id="updateUserForm">
								<label for="firstname">Prénom</label>
								<input type="text" name="firstname" />
								<label for="lastname">Nom</label>
								<input type="text" name="lastname" />
								<label for="role">Rôle</label>
								<select name="role">
									<option value="0">0 - Leader</option>
									<option value="1">1 - Suiveur</option>
								</select>
								<label for="state">État</label>
								<select name="state">
									<option value="0">0 - Liste d'attente</option>
									<option value="1">1 - En attente de paiement</option>
									<option value="2">2 - Inscrit</option>
								</select>
								<label for="partner">Partenaire</label>
								<input type="text" name="partner" disabled />
								<button class="btn" type="button" on:click={() => updateUser(user)}
									>Mettre à jour</button
								>
								<button class="btn" type="button" on:click={() => closeUpdate(user.id)}
									>Annuler</button
								>
							</form>
						</div>
					</div>
				{/each}
			{/if}
		</tbody>
	</table>
</section>

<style lang="scss">
	.reset__btn {
		color: #000;
		background-color: #bbb;
	}
	.no__users {
		text-align: left;
	}
	.update__container,
	.delete__modal {
		display: none;
		position: fixed;
		background-color: #fff;
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: 12px;
		padding: 2rem;
		z-index: 100;
		flex-direction: column;
		background-color: rgb(0 0 0 / 68%);
		align-items: center;
		justify-content: center;
	}
	.update__container__in {
		background-color: #fff;
		border-radius: 12px;
		padding: 2rem;
		width: 760px;
		height: auto;
	}

	.delete__container__in {
		background-color: #fff;
		border-radius: 12px;
		padding: 2rem;
		flex-direction: column;
		max-width: 460px;
		width: auto;
		height: auto;
	}
	.delete__modal {
		gap: 3.5rem;
		p {
			margin-bottom: 2rem;
			text-align: center;
		}
		div {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}
	}
	.update__header {
		display: flex;
		justify-content: space-between;
		width: 100%;

		p {
			padding: 0 2rem;
		}
	}
	td {
		button + button {
			margin-top: 1rem;
		}
	}
	@media (max-width: 768px) {
		.update__container {
			width: 90%;
		}
	}
</style>
