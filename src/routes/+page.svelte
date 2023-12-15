<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';
	export let data;

	async function handleSubmit(event) {
        event.preventDefault();
        try {
			const response = await fetch(event.target.action, {
				method: event.target.method,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(event.target))
            });
			console.log("success logout");
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
        } catch (error) {}
    }
</script>

<header>
	<a href="/admin/login">Administration</a>
	<form action="/" method="post" on:submit={handleSubmit}>
		<button type="submit">Logout</button>
	</form>
</header>

<h1>Norma</h1>

<ul class="events-list">
	{#each data.data as event}
		<li class="event">
			<Card>
				<Content>
					<!-- <img src={event.widgetVignetteHorizontalUrl} alt={event.title} class="event-img" /> -->
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
