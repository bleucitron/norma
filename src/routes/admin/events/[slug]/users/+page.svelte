<script>
	export let data;
	let users = data.users;

	let searchTerm = '';
	let roleFilter = '';
	let stateFilter = '';
	let sortColumn = '';
	let sortOrder = 1;
	let sortedUsers = users.slice();

	$: filteredUsers = sortedUsers.filter((user) => {
		const trimmedSearchTerm = searchTerm.trim().toLowerCase();
		const trimmedFullName = `${user.firstname} ${user.lastname}`.toLowerCase();

		const isSearchMatch = trimmedSearchTerm === '' || trimmedFullName.includes(trimmedSearchTerm);
		const isRoleMatch = roleFilter === '' || user.role === roleFilter;
		const isStateMatch = stateFilter === '' || user.state === stateFilter;

		return isSearchMatch && isRoleMatch && isStateMatch;
	});

	$: numberOfFilteredUsers = filteredUsers.length;

	function toggleSort(column) {
		if (column === sortColumn) {
			sortOrder *= -1;
		} else {
			sortOrder = 1;
			sortColumn = column;
		}

		if (column === 'created_at') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const dateA = formatToFrenchDate(a.created_at);
				const dateB = formatToFrenchDate(b.created_at);
				return sortOrder * (dateA - dateB);
			});
		} else {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = column === 'role' ? a.role : a.state;
				const valueB = column === 'role' ? b.role : b.state;
				return sortOrder * valueA.localeCompare(valueB);
			});
		}
	}

	function resetState() {
		searchTerm = '';
		roleFilter = '';
		stateFilter = '';
		sortColumn = '';
		sortOrder = 1;
		sortedUsers = users.slice();
	}

	function formatToFrenchDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	function filterUsersByRole(e) {
		roleFilter = e.target.value;
	}

	function filterUsersByState(e) {
		stateFilter = e.target.value;
	}
</script>

<section class="users__container">
	<h1>Listes des participants</h1>
	{#if numberOfFilteredUsers === 1}
		<p>Il y a {numberOfFilteredUsers} participant trouvé</p>
	{:else if numberOfFilteredUsers > 1}
		<p>Il y a {numberOfFilteredUsers} participants trouvés</p>
	{:else}
		<p>Aucun participant trouvé</p>
	{/if}

	<div class="filters__container">
		<div class="search__container">
			<span class="search-icon">🔍</span>
			<input type="text" bind:value={searchTerm} placeholder="Rechercher un participant" />
		</div>
		<button on:click={resetState}>Réinitialiser</button>
	</div>

	<div class="filters__container__column">
		<div>
			<p>Filtrer par :</p>
		</div>
		<div class="filters__container">
			<select on:change={(e) => filterUsersByRole(e)}>
				<option value="">--Choisir le rôle--</option>
				<option value="Leader">Leader</option>
				<option value="Suiveur">Suiveur</option>
			</select>
			<select on:change={(e) => filterUsersByState(e)}>
				<option value="">--Choisir l'état--</option>
				<option value="Inscrit">Inscrit</option>
				<option value="En attente">En attente</option>
			</select>
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th on:click={() => toggleSort('name')}>
					Nom
					<span class:desc={sortOrder === -1 && sortColumn === 'name'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('role')}>
					Rôle
					<span class:desc={sortOrder === -1 && sortColumn === 'role'} class="sort-icon"></span>
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
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if numberOfFilteredUsers === 0}
				<tr>
					<td colspan="5">Aucun utilisateur trouvé</td>
				</tr>
			{:else}
				{#each filteredUsers as user}
					<tr>
						<td>{user.firstname} {user.lastname}</td>
						<td>{user.role}</td>
						<td>{user.state}</td>
						<td>{formatToFrenchDate(user.created_at)}</td>
						<td>
							<button>Modifier</button>
							<button>Supprimer</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</section>
