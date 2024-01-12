<script>
	export let data;
	console.log(data);
	
</script>

<svelte:head>
	<title>Inscription à l'évènement {data.title} </title>
</svelte:head>
<div class=form__tpl>
	<h1>Inscription à {data.title}</h1>
	<img src={data.logo.publicUrl} alt={`Logo de ${data.title}`} />
	<form action="register" method="post">
			<div class="form__group">
				<label for="firstname">Prénom</label>
				<input type="text" name="firstname" />
			</div>
			<div class="form__group">
				<label for="lastname">Nom</label>
				<input type="text" name="lastname" />
			</div>
			<div class="form__group">
				<label for="email">Email</label>
				<input type="email" name="email" />
			</div>
			<div class="form__group">
				<label for="password">Mot de passe</label>
				<input type="password" name="password" />
			</div>
			<div class="form__group">
				<label for="password-confirm">Confirmation de mot de passe</label>
				<input type="password" name="password-confirm" />
			</div>
			<button type="submit">S'inscrire</button>
		</form>
</div>