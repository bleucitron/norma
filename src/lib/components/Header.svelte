<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate, goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';

	export let user: any;

	const logout = async () => {
		await $page.data.supabase.auth.signOut();
		invalidate('supabase:auth');
		setTimeout(() => goto('/'), 0);
		toast.push('Déconnexion réussie', {
			theme: {
				'--toastBackground': '#4caf50',
				'--toastProgressBackground': '#81c784',
				'--toastProgressAfterBackground': '#a5d6a7',
				'--toastColor': '#fff',
				'--toastProgressColor': '#fff',
				'--toastProgressAfterColor': '#fff'
			}
		});
	};
</script>

<header>
	<div class="container">
		<a href="/" class="header__logo"><img src="/assets/norma-logo.png" alt="logo" /></a>
		{#if user}
			<div class="btn__container">
				<a class="btn" href="/admin">Accueil</a>
				<button class="btn" on:click={logout}>Déconnexion</button>
			</div>
		{/if}
	</div>
</header>
