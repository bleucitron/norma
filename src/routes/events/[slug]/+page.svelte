<script>
	export let data;
	const event = data.event;
</script>

<section class="event__container">
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
							<li>{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €</li>
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
