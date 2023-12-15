<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';

	export let data;
</script>

<header>
	<a href="/admin/login">Administration</a>
</header>

<h1>Norma</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<Card>
				<Content>
					<img src={event.widgetVignetteHorizontalUrl} alt={event.title} class="event-img" />
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
