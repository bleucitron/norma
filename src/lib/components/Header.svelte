<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate, goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast'


	export let user: any;

	const logout = async () => {
		await $page.data.supabase.auth.signOut();
		invalidate('supabase:auth');
		setTimeout(() => goto('/'), 0);
		toast.push('Déconnexion réussie');
	};
</script>

<header>
	<div class="container">
		<a href="/" class="header__logo">Norma</a>
		{#if user}
			<button on:click={logout}>Déconnexion</button>
		{/if}
	</div>
</header>
