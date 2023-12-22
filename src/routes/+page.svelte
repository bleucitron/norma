<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';
	export let data;
</script>

<h1>Les événements actuels</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<Card>
				<Content>
					{#if event.logo}<img
							src={event.logo.publicUrl}
							alt={event.title}
							class="event-img"
						/>{/if}
					<h2>{event.title}</h2>
				</Content>
				<Actions>
					<ActionButtons>
						<Button href="/events/{event.formSlug}" variant="raised">Voir</Button>
					</ActionButtons>
				</Actions>
			</Card>
		</li>
	{/each}
</ul>

<style>
	h1 {
		font-size: 4rem;
		line-height: calc(4rem * 1.4);
		margin: 4rem 0 2rem 0;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}
	.event-img {
		width: 100%;
		height: 120px;
		object-fit: cover;
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
	@media (max-width: 768px) {
		h1 {
			font-size: 3rem;
			line-height: calc(3rem * 1.4);
		}
		.events-list {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
