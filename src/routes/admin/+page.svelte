<script lang="ts">
	export let data;
	let todayDate = new Date();
	let archivedEvents: Array<any> = [];
	let events: any;

	if (Array.isArray(data.events)) {
		events = data.events.filter((event) => {
			if (new Date(event.endDate) < todayDate) {
				archivedEvents.push(event);
				return false;
			}
			return true;
		});
	} else {
		console.error('data.events is not an array');
	}

	function formatCurrency(value, currency) {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency
		}).format(value);
	}

	const registeredDancers = data.dancers.length;

	const followersDancers = data.dancers.filter((dancer) => dancer.role === 'Suiveur');
	const numberOfFollowersDancers = followersDancers.length;

	const leadersDancers = data.dancers.filter((dancer) => dancer.role === 'Leader');
	const numberOfLeadersDancers = leadersDancers.length;
</script>

<div class="header-container">
	<h1>Vos derniers événements</h1>
	<div class="btn__container">
		<a href={`/admin/events`} class="btn">Voir tous les évenements</a>
	</div>
</div>

<ul class="events-list">
	{#each events.slice(0, 2) as event}
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

<h2>Les statistiques de vos évènements</h2>
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
					<p class="amount-raised">
						Montant récolté : {formatCurrency(event.amountRaised, event.currency)}
					</p>
					<p class="tickets-sold">Pass vendus : {event.ticketsSold}</p>
				</div>
				<div class="fake-charts">
					<div class="fake-chart">
						<h3>Équilibre Leader / Suiveur</h3>
						<p>Nombre total de danseurs inscrits : {registeredDancers}</p>
						<p>Nombre de leaders inscrits : {numberOfFollowersDancers}</p>
						<p>Nombre de followers inscrits : {numberOfLeadersDancers}</p>
					</div>
					<div class="fake-chart">
						<h3>Équilibre Pass</h3>
						<p>Pass Cours : 20/50</p>
						<p>Pass Compétition : 40/50</p>
						<p>Pass Complet : 10/50</p>
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

	h2 {
		margin: 32px 0 12px;
	}

	.fake-charts {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20px;
	}

	.fake-chart {
		background: #f7f7f7;
		border: 1px solid #ddd;
		padding: 10px;
		margin-bottom: 10px;
	}
</style>
