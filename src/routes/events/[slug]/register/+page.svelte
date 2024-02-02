<script>
</script>

<svelte:head>
	<title>Mes informations complémentaires</title>
</svelte:head>
<div id="login__page" class="form__tpl">
	<h1>Renseignez-nous !</h1>
	<form action="register" method="post">
		<div class="form-group">
			<label for="firstname">Prénom</label>
			<input
				type="text"
				name="firstname"
				id="firstname"
				required
				aria-required="true"
				placeholder="Votre prénom"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="lastname">Nom</label>
			<input
				type="text"
				name="lastname"
				id="lastname"
				required
				aria-required="true"
				placeholder="Votre nom"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				value=""
				required
				aria-required="true"
				placeholder="Enter your email"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email de votre partenaire</label>
			<input
				type="email"
				name="partnaire_email"
				id="email"
				value=""
				placeholder="Email de votre partenaire"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="role-select">Votre rôle :</label>
			<select name="role" id="role-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Leader">Leader</option>
				<option value="Suiveur">Suiveur</option>
			</select>
		</div>
		<div class="form-group">
			<label for="level-select">Votre niveau :</label>
			<select name="level" id="level-select" required>
				<option value="">--Please choose an option--</option>
				<option value="Débutant">Débutant</option>
				<option value="Confirmé">Confirmé</option>
				<option value="Expert">Expert</option>
			</select>
		</div>
		<button type="submit">Poursuivre l'inscription</button>
	</form>
</div>
