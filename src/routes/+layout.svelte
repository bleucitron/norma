<script lang="ts">
	import '../style/global.scss';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import NetworkStatus from '$lib/components/NetworkStatus.svelte';

	export let data;

	$: ({ supabase } = data);
	$: user = data.user;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== _session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	onMount(() => {
		const adminlinks = document.querySelectorAll('.admin__link');
		const navLinks = document.querySelectorAll('.nav__item');
		adminlinks.forEach((link) => {
			link.addEventListener('click', () => {
				adminlinks.forEach((link) => link.classList.remove('activLink'));
				link.classList.add('activLink');
			});
		});
		navLinks.forEach((link) => {
			link.addEventListener('click', () => {
				navLinks.forEach((link) => link.classList.remove('activLink'));
				link.classList.add('activLink');
			});
		});
	});
</script>

<Header {user} />
<SvelteToast />
<NetworkStatus />

<main class="container-column">
	<slot />
</main>

<style lang="scss">
</style>
