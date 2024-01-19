<script>
	export let data;
</script>

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
	{#each data.data.slice(0, 2) as event}
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
						<a href={`/admin/events/${event.id}/users`} class="btn">Voir les participants</a>
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
	body {
		font-family: 'Arial', sans-serif;
		background-color: #f4f4f4;
		color: #333;
		line-height: 1.6;
		padding: 20px;
	}

	h1 {
		color: #333;
		margin-bottom: 34px;
	}

	.events-list {
		list-style: none;
		padding: 0;
	}

	.event {
		background: #fff;
		margin-bottom: 20px;
		border: 1px solid #ddd;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.event-image-container {
		width: 100%;
		height: 300px;
		overflow: hidden;
	}

	.event-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card__content {
		padding: 15px;
	}

	.btn__container {
		margin-top: 10px;
	}

	.btn {
		text-decoration: none;
		color: #fff;
		padding: 10px 15px;
		border: none;
		margin-right: 10px;
		cursor: pointer;
	}
	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 34px;
	}

	.header-container .btn__container a {
		min-width: 220px;
	}

	.header-container h1 {
		margin: 0;
	}
</style>
