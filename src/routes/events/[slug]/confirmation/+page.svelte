<script lang="ts">
	export let data;
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

<section class="template">
	<div class="hero container-error">
		<div class="hero__content">
			<div class="wrapper">
				<h1 class="header__logo">🎉 Vous etes inscrit 🎉</h1>
			</div>
			<p>
				Merci pour votre inscription à notre évènement <strong>{data.event.title}</strong>. 🎉
			</p>
			<a href="/" class="btn discover__btn">Retour à la page d'accueil</a>
		</div>
	</div>
</section>
