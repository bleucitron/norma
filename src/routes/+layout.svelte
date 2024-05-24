<script lang="ts">
	import '../style/global.scss';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { Session } from '@supabase/supabase-js';
	import type { AuthChangeEvent } from '@supabase/supabase-js';

	export let data;

	$: ({ supabase } = data);
	$: user = data.user;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event: AuthChangeEvent, _session: Session | null) => {
			if (_session?.expires_at !== _session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Header {user} />
<SvelteToast />
<main class="container-column">
	<slot />
</main>
<Footer />
