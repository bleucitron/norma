<script>
	export let data;
</script>

<svelte:head></svelte:head>

<div class="header-container">
	<h1>Tous vos événements</h1>
	<div class="btn__container">
		<a href={`/admin`} class="btn">Retour au dashboard</a>
	</div>
</div>

<ul class="events-list">
	{#each data.events as event}
		<li class="event">
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
						<a href="/admin/events/{event.formSlug}/users" class="btn">Voir les participants</a>
						<a
							href="https://admin.helloasso.com/{event.organizationSlug}/evenements/{event.formSlug}/edition/1"
							class="btn">Gérer</a
						>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>
