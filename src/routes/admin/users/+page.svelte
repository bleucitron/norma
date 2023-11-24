<script>
	import { users } from '../../../data/users.json';

	let numberOfUser = users.length;
</script>

<section class="users__container">
	<h1>Listes des utilisateurs</h1>
	<p>Il y a {numberOfUser} utilisateurs</p>
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Inscrit le</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr class="item" role="button">
					<td>{user.firstname} {user.lastname}</td>
					<td>{user.created_at}</td>
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
