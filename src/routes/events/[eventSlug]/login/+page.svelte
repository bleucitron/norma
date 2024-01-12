<script>
	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>Connexion</title>
</svelte:head>
<main>
	<h1>Connectez-vous pour commencer votre inscription</h1>
	<div class="form-group">
		<form action="login" method="post">
			<div>
				<label for="email">Email</label>
				<input type="email" name="email" />
			</div>
			<div>
				<label for="password">Mot de passe</label>
				<input type="password" name="password" />
			</div>
			<button type="submit">Se connecter</button>
			<p>Pas encore de compte, <a href="/events/{data.eventSlug}/register">inscrivez-vous</a> !</p>
		</form>
	</div>
</main>

<style>
	main {
		background-color: #f4f4f4;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		margin: 2rem auto;
	}

	h1 {
		text-align: center;
		color: #333;
		font-family: 'Arial', sans-serif;
	}

	.form-group {
		background-color: white;
		padding: 2rem;
		border-radius: 8px;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #555;
	}

	input[type='text'],
	input[type='email'],
	input[type='password'] {
		width: 100%;
		padding: 0.8rem;
		margin-bottom: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-sizing: border-box;
	}

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='password']:focus {
		border-color: #ff3e00;
		outline: none;
	}

	button[type='submit'] {
		width: 100%;
		padding: 1rem;
		border: none;
		border-radius: 4px;
		background-color: #ff3e00;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button[type='submit']:hover {
		background-color: #c73403;
	}
</style>
