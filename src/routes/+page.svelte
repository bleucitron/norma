<script>
	export let data;
</script>

<h1>Les événements actuels</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<a href="/events/{event.formSlug}" class="card">
				<div class="card__img">
			<div class="event__item">
				<div>
					{#if event.logo}<img
							src={event.logo.publicUrl}
							alt={event.title}
							class="event-img"
						/>{/if}
				</div>
				<div class="card__content">
					<h2>{event.title}</h2>
					<p>{event.description}</p>
					<div class="btn__container">
						<a href="/events/{event.formSlug}" class="btn">Voir</a>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	:global(.mdc-card__action-buttons) {

	.event-img {
		width: 100%;
		height: 240px;
		object-fit: cover;
	}

	.event__item {
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	}

	.events-list {
		padding-left: 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4rem;
		margin-bottom: 2rem;
	}
	.events-list .event {
		list-style: none;
	}

	.card__content {
		padding: 2rem;
		gap: 1rem;
		display: flex;
		flex-direction: column;

		p {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
}
</style>
