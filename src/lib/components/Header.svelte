<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import Button from '@smui/button';

	export let user: any;

	const logout = async () => {
		await $page.data.supabase.auth.signOut();
		invalidate('supabase:auth');
	};
</script>

<header>
	{#if user}
		<p>{user.email}</p>
		<Button on:click={logout}>Déconnexion</Button>
	{/if}
</header>
