<script>
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
	export let data;
	const event = data.event;
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

<section class="event__container event-details">
	<div class="wrapper">
		<div class="card__img">
			<div>
				<div>
					{#if event.logo}
						<img src={event.logo.publicUrl} alt={`Logo de ${event.title}`} />
					{/if}
				</div>
				<div class="event__info">
					<h1>{event.title}</h1>
					<p>Type de l'événement : {event.activityType}</p>
					<p>{event.description}</p>
					<h2>Tickets disponibles :</h2>
					<ul>
						{#each event.tiers as price}
							<li class="event-info">
								{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €
							</li>
						{/each}
					</ul>
				</div>
				<div class="btn-container">
					<a class="btn" href="/events/{event.formSlug}/register">S'inscrire</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style scoped lang="scss">
	.event-info {
		font-size: 1.4rem;
	}
</style>
