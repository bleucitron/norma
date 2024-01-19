<script>
	export let data;
</script>

<svelte:head>
	<title>Connexion</title>
</svelte:head>

<div id="login__page" class="form__tpl">
	<h1>Connexion</h1>
	<form method="post">
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
			<label for="password">Mot de passe</label>
			<input
				type="password"
				name="password"
				id="password"
				required
				aria-required="true"
				placeholder="Enter your password"
				class="form-control"
			/>
		</div>
		<button type="submit" class="btn">Connexion</button>
	</form>
	<a class="create__account" href="/events/{data.eventSlug}/register">Créer un compte</a>
</div>
