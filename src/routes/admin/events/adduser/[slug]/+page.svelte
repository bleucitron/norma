<script>
</script>

<svelte:head>
	<title>Ajouter un participant</title>
</svelte:head>
<div id="login__page" class="form__tpl">
	<h1>Ajouter un participant</h1>
	<form action="register" method="post">
		<div class="form-group">
			<label for="firstname">Prénom du nouveau participant</label>
			<input
				type="text"
				name="firstname"
				id="firstname"
				required
				aria-required="true"
				placeholder="Prénom"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="lastname">Nom du nouveau participant</label>
			<input
				type="text"
				name="lastname"
				id="lastname"
				required
				aria-required="true"
				placeholder="Nom"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email du nouveau participant</label>
			<input
				type="email"
				name="email"
				id="email"
				value=""
				required
				aria-required="true"
				placeholder="Email"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email de son partenaire</label>
			<input
				type="email"
				name="partnaire_email"
				id="email"
				value=""
				placeholder="Email de son partenaire"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="role-select">Son rôle :</label>
			<select name="role" id="role-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Leader">Leader</option>
				<option value="Suiveur">Suiveur</option>
			</select>
		</div>
		<div class="form-group">
			<label for="level-select">Son niveau :</label>
			<select name="level" id="level-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Débutant">Débutant</option>
				<option value="Confirmé">Confirmé</option>
				<option value="Expert">Expert</option>
			</select>
		</div>
		<button type="submit">Ajouter un participant</button>
	</form>
</div>
