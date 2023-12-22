<script>
	export let data;
</script>

<h1>Les événements actuels</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<a href="/events/{event.formSlug}" class="card">
				<div class="card__img">
					{#if event.logo}<img
							src={event.logo.publicUrl}
							alt={event.title}
							class="event-img"
						/>{/if}
				</div>
				<div class="card__content">
					<h2>{event.title}</h2>
				</div>
				<div class="card__actions">
					<a href="/events/{event.formSlug}" class="btn">Voir</a>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	:global(.mdc-card__action-buttons) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5rem;
		width: 100%;
	}
	:global(.mdc-card__action--button) {
		margin-right: 0;
	}
</style>
