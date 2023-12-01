<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';

	let datas = [
		{
			id: 1,
			name: "Nom de l'evenement",
			img: 'https://images.musement.com/cover/0001/100/predator-v5-jpg_header-99107.jpeg'
		}
	];

	export let data;
	console.log(data.data);
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
						<Button href="/events/{event.id}" variant="raised">Voir</Button>
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
