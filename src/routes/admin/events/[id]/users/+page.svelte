<script>
	import { users } from '../../../../../data/usersEvent.json';

	let filteredUser = users;

	// @ts-ignore
	function filterUsersByRole(e) {
		switch (e.target.value) {
			case 'Leader':
				filteredUser = users.filter((user) => user.role === 'Leader');
				break;
			case 'Suiveur':
				filteredUser = users.filter((user) => user.role === 'Suiveur');
				break;
			default:
				filteredUser = users.slice();
				break;
		}
	}
</script>

<section class="users__container">
	<h1>Les participants</h1>

	<div class="users__filters">
		<p>Filtrer par :</p>
		<div class="filters__container">
			<select on:change={(e) => filterUsersByRole(e)}>
				<option value="">Role</option>
				<option value="Leader">Leader</option>
				<option value="Suiveur">Suiveur</option>
			</select>
			<select>
				<option value="">Etat</option>
				<option value="Inscrit">Inscrit</option>
				<option value="En attente">En attente</option>
			</select>
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Rôle</th>
				<th>État</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredUser as user}
				<tr class="item" role="button">
					<td>{user.firstname} {user.lastname}</td>
					<td>{user.role}</td>
					<td>{user.state}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style lang="scss">
	.users__container {
		padding: 0 20px;

		h1 {
			color: #000;
			font-family: Source Serif Pro;
			font-size: 36px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}
	.users__filters {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 0.8rem;
	}
	.filters__container {
		display: flex;
		flex-direction: row;
		gap: 0.8rem;
	}
	table {
		width: 100%;
		margin: 2rem 0;
		border: 1px solid #e8e8e8;
	}
	table,
	th,
	td {
		border-collapse: collapse;
	}
	th:last-of-type,
	td:last-of-type {
		text-align: right;
	}
	th,
	td {
		padding: 20px 10px;
		text-align: left;
	}
	thead tr {
		background-color: #e8e8e8;
	}
	tbody tr {
		border-bottom: 1px solid #e8e8e8;
	}
</style>
