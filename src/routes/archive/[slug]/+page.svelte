<script>
	export let data;
	const event = data.event;
</script>

<div class="header-container archived-banner">
	<h2>Cet événement est terminé</h2>
</div>
<section class="event__container events-archived">
	<div class="wrapper">
		<div class="card__img">
			<div>
				<div>
					{#if event.logo}
						<img src={event.logo.publicUrl} alt={`Logo de ${event.title}`} />
					{/if}
				</div>
				<div>
					<h1>{event.title}</h1>
					<p>Type de l'événement : {event.activityType}</p>
					<p>{event.description}</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		max-width: 700px;
		margin: 0 auto;
		img {
			width: 100%;
			height: 300px;
			object-fit: cover;
		}

		h1 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
