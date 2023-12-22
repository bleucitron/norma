<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate, goto } from '$app/navigation';
	import Button from '@smui/button';
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
			<Button on:click={logout}>Déconnexion</Button>
		{/if}
	</div>
</header>
