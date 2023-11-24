<script>
	import { json } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data;
	/*function openHelloAssoModal() {
		window.open(
			'https://auth.helloasso.com/authorize?client_id=3ee3baa68ec640ee87665c4ee3d4c0ab&code_challenge=' +
				encodeURIComponent(data.token) +
				'&code_challenge_method=S256&redirect_uri=http://localhost:5173/'
		);
	}*/
	onMount(async () => {
		const client_id = '3ee3baa68ec640ee87665c4ee3d4c0ab';
		const client_secret = 'yFOx6BqYJomxyWZnSH9F+Urjp7Ujj36R';
		let conf = await fetch('https://api.helloasso.com/oauth2/token', {
			method: 'POST',
			body: `client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(
				client_secret
			)}&grant_type=client_credentials`
		}).then((resp) => resp.json());
		console.log(conf);
	});

	console.log(data);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button class="HaAuthorizeButton">
	<img
		src="https://api.helloasso.com/v5/DocAssets/logo-ha.svg"
		alt=""
		class="HaAuthorizeButtonLogo"
	/>
	<span class="HaAuthorizeButtonTitle">Connecter à HelloAsso</span>
</button>

<style>
	.HaAuthorizeButton {
		align-items: center;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		background-color: #ffffff;
		border: 0.0625rem solid #49d38a;
		border-radius: 0.125rem;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		padding: 0;
	}
	.HaAuthorizeButton:disabled {
		background-color: #e9e9f0;
		border-color: transparent;
		cursor: not-allowed;
	}
	.HaAuthorizeButton:not(:disabled):focus {
		box-shadow: 0 0 0 0.25rem rgba(73, 211, 138, 0.25);
		-webkit-box-shadow: 0 0 0 0.25rem rgba(73, 211, 138, 0.25);
	}
	.HaAuthorizeButtonLogo {
		padding: 0 0.8rem;
		width: 2.25rem;
	}
	.HaAuthorizeButtonTitle {
		background-color: #49d38a;
		color: #ffffff;
		font-size: 1rem;
		font-weight: 700;
		padding: 0.78125rem 1.5rem;
	}
	.HaAuthorizeButton:disabled .HaAuthorizeButtonTitle {
		background-color: #e9e9f0;
		color: #9a9da8;
	}
	.HaAuthorizeButton:not(:disabled):hover .HaAuthorizeButtonTitle,
	.HaAuthorizeButton:not(:disabled):focus .HaAuthorizeButtonTitle {
		background-color: #30c677;
	}
</style>
