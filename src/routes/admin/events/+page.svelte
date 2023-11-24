<script>
	import Button, { Label } from '@smui/button';
	import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons } from '@smui/card';

	let data = [
		{
			id: 1,
			name: "Nom de l'evenement",
			img: 'https://images.musement.com/cover/0001/100/predator-v5-jpg_header-99107.jpeg'
		}
	];
</script>

<svelte:head>
</svelte:head>

<h1>Vos événements</h1>

<ul class="events-list">
	{#each data as event}
		<li class="event">
			<Card>
				<Content>
					<img src={event.img} alt={event.name} class="event-img" />
					<h2>{event.name}</h2>
				</Content>
				<Actions>
					<ActionButtons>
						<Button href="/admin/events/{event.id}/users" variant="raised"
							>Voir les participants</Button
						>
						<Button variant="raised">Gérer</Button>
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
