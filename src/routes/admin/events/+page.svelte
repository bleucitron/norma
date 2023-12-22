<script>
	export let data;
</script>

<svelte:head></svelte:head>

<h1>Vos événements</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<div class="card">
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
					<a href="/admin/events/{event.id}/users" class="btn">Voir les participants</a>
					<a href="/admin/events/{event.id}/edit" class="btn">Gérer</a>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.event-img {
		width: 100%;
		height: 120px;
		object-fit: cover;
	}
	.events-list {
		padding-left: 0;
	}
	.events-list .event {
		list-style: none;
	}
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
