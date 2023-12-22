<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<div id="login__page">
  <h1>Connexion</h1>
<form method="post" use:enhance>
	<div class="form-group">
		<label for="email">Email Address</label>
		<input
			type="email"
			name="email"
			id="email"
			value={form?.email ?? ''}
			required
			aria-required="true"
			placeholder="Enter your email"
			class="form-control"
		/>
	</div>
	<div class="form-group">
		<label for="password">Password</label>
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
	<button type="submit" class="btn">Login</button>
</form>
  <a href="/register">Créer un compte</a>
</div>

<style lang="scss">
	.form-group {
		margin-bottom: 15px;
		width: 100%;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
	}

	.form-control {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.form-control:focus {
		border-color: #0056b3;
		outline: none;
	}
</style>
