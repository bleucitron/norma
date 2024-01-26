<script>
	export let data;
	// const registeredDancers = data.dancers.map((registeredDancer) => {
	// 	return registeredDancer;
	// });

	// const newRegisteredDancers = data.dancers.length;
</script>

<!-- <p>Nombre total de danseurs inscrits : {newRegisteredDancers}</p> -->

<div class="header-container">
	<h1>Vos derniers événements</h1>
	<div class="btn__container">
		<a href={`/admin/events`} class="btn">Voir tous les évenements</a>
	</div>
	<div class="btn__container">
		<a href={`/admin/users`} class="btn">Voir tous les utilisateurs</a>
	</div>
</div>

<ul class="events-list">
	{#each data.events.slice(0, 2) as event}
		<li class="event">
			<div class="event__item">
				<div>
					{#if event.logo}
						<div class="event-image-container">
							<img src={event.logo.publicUrl} alt={event.title} class="event-img" />
						</div>
					{/if}
				</div>
				<div class="card__content">
					<h2>{event.title}</h2>
					<p>{event.description}</p>
					<div class="btn__container">
						<a href={`/admin/events/${event.formSlug}/users`} class="btn">Voir les participants</a>
						<a
							href={`https://admin.helloasso.com/${event.organizationSlug}/evenements/${event.formSlug}/edition/1`}
							class="btn"
							target="_blank">Gérer</a
						>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.btn {
		text-decoration: none;
		color: #fff;
		padding: 10px 15px;
		border: none;
		margin-right: 10px;
		cursor: pointer;
	}
	.header-container .btn__container a {
		min-width: 220px;
	}
</style>
