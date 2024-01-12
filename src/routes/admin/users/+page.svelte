<script>
	import { users } from '../../../data/users.json';
  
	let searchTerm = '';
	let sortColumn = '';
	let sortOrder = 1;
	let sortedUsers = users.slice();
  
	$: filteredUsers = sortedUsers.filter(user => {
	  const trimmedSearchTerm = searchTerm.trim();
	  if (trimmedSearchTerm === '') {
		return true;
	  }
  
	  const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
	  return fullName.includes(trimmedSearchTerm.toLowerCase());
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
				const dateA = parseFrenchDate(a.created_at);
				const dateB = parseFrenchDate(b.created_at);
				return sortOrder * (dateA - dateB);
			});
		} else {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				if (column === 'name') {
					return sortOrder * (a.firstname + ' ' + a.lastname).localeCompare(b.firstname + ' ' + b.lastname);
				} else {
					return sortOrder * a[column].localeCompare(b[column]);
				}
			});
		}
	}

	function resetState() {
		searchTerm = '';
		sortColumn = '';
		sortOrder = 1;
		sortedUsers = users.slice();
	}

	function parseFrenchDate(dateString) {
		const [day, month, year] = dateString.split('/');
		return new Date(`${year}-${month}-${day}`);
	}
  </script>
  
  <section class="users__container">
	<h1>Listes des utilisateurs</h1>
	{#if numberOfFilteredUsers === 1}
	  <p>Il y a {numberOfFilteredUsers} utilisateur trouvé</p>
	{:else if numberOfFilteredUsers > 1}
	  <p>Il y a {numberOfFilteredUsers} utilisateurs trouvés</p>
	{:else}
	  <p>Aucun utilisateur trouvé</p>
	{/if}
	<div class="filters__container">
		<div class="search__container">
			<span class="search-icon">🔍</span>
			<input type="text" bind:value={searchTerm} placeholder="Rechercher un utilisateur" />

		</div>
	  <button on:click={resetState}>Réinitialiser</button>
	</div>
	<table>
	  <thead>
		<tr>
		  <th on:click={() => toggleSort('name')}>
			Nom
			<span class:desc={sortOrder === -1 && sortColumn === 'name'} class="sort-icon"></span>
		  </th>
		  <th on:click={() => toggleSort('created_at')}>
			Inscrit le
			<span class:desc={sortOrder === -1 && sortColumn === 'created_at'} class="sort-icon"></span>
		  </th>
		</tr>
	  </thead>
	  <tbody>
		{#if numberOfFilteredUsers === 0}
		  <tr>
			<td>Aucun utilisateur trouvé</td>
		  </tr>
		{:else}
		  {#each filteredUsers as user}
			<tr>
			  <td>{user.firstname} {user.lastname}</td>
			  <td>{user.created_at}</td>
			</tr>
		  {/each}
		{/if}
	  </tbody>
	</table>
  </section>
  
  