<script>
	//export let data;
	// console.log(data);
</script>

<svelte:head>
	<title>Mes informations complémentaires</title>
</svelte:head>
<main>
	<h1>Renseignez-nous !</h1>
	<div class="form-group">
		<form action="dancer-info" method="post">
			<label for="role-select">Votre rôle :</label>
			<select name="role" id="role-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Leader">Leader</option>
				<option value="Suiveur">Suiveur</option>
			</select>
			<label for="level-select">Votre niveau :</label>
			<select name="level" id="level-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Débutant">Débutant</option>
				<option value="Confirmé">Confirmé</option>
				<option value="Expert">Expert</option>
			</select>
			<button type="submit">Poursuivre l'inscription</button>
		</form>
	</div>
</main>
