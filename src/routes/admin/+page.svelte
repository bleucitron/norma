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

	// Utilisateur non inscrit = 0
	// Utilisateur en attente = 1
	// Utilisateur inscrit = 2

	// Leader = 0
	// Suiver = 1

	// Débutant, confirmé, expert

	const registeredDancers = data.dancers.filter((dancer) => dancer.state === 'Inscrit');

	// const eventTitles = data.events.map((event) => normalizeEventTitle(event.title));

	const eventStats = {};

	function normalizeEventTitle(title) {
		return title.toLowerCase().replace(/\s+/g, '-');
	}

	const allLevels = [...new Set(registeredDancers.map((dancer) => dancer.level || 'Non spécifié'))];

	registeredDancers.forEach((dancer) => {
		const eventName = normalizeEventTitle(dancer.event);
		const level = dancer.level || 'Non spécifié';

		if (!eventStats[eventName]) {
			eventStats[eventName] = {
				total: 0,
				leaders: 0,
				followers: 0,
				levels: {}
			};
		}

		eventStats[eventName].total++;

		if (dancer.role === 'Leader') {
			eventStats[eventName].leaders++;
		} else if (dancer.role === 'Suiveur') {
			eventStats[eventName].followers++;

			if (!eventStats[eventName].levels[level]) {
				eventStats[eventName].levels[level] = {
					leaders: 0,
					followers: 0
				};
			}

			eventStats[eventName].levels[level].followers++;
		}
	});

	allLevels.forEach((level) => {
		registeredDancers.forEach((dancer) => {
			const eventName = normalizeEventTitle(dancer.event);

			if (dancer.role === 'Leader' && dancer.level === level) {
				if (!eventStats[eventName].levels[level]) {
					eventStats[eventName].levels[level] = {
						leaders: 0,
						followers: 0
					};
				}

				eventStats[eventName].levels[level].leaders++;
			}
		});
	});

	console.log(eventStats);
</script>

<div class="header-container">
	<h1>Vos derniers événements</h1>
	<div class="btn__container">
		<a href={`/admin/events`} class="btn">Voir tous les évenements</a>
	</div>
</div>

<p>Nombre total d'inscrits aux compétitions : {registeredDancers.length}</p>

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

<ul class="events-list">
	{#each data.events as event}
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
				</div>
				<div class="fake-charts">
					<div class="fake-chart">
						<h3>Équilibre Leader / Suiveur</h3>
						{#if eventStats[normalizeEventTitle(event.title)]}
							<p>
								Nombre total de danseurs inscrits : {eventStats[normalizeEventTitle(event.title)]
									.total}
							</p>
							<h4>Niveau des inscrits :</h4>
							<ul>
								{#each allLevels as level}
									{#if eventStats[normalizeEventTitle(event.title)].levels[level]}
										<li>
											{#if eventStats[normalizeEventTitle(event.title)].levels[level].leaders > 0 || eventStats[normalizeEventTitle(event.title)].levels[level].followers > 0}
												{level} - Leaders: {eventStats[normalizeEventTitle(event.title)].levels[
													level
												].leaders}, Suiveurs: {eventStats[normalizeEventTitle(event.title)].levels[
													level
												].followers}
											{:else if eventStats[normalizeEventTitle(event.title)].levels[level].leaders === 0 && eventStats[normalizeEventTitle(event.title)].levels[level].followers === 0}
												{level} - Pas de données
											{/if}
										</li>
									{:else}
										<li>{level} - Pas de données</li>
									{/if}
								{/each}
							</ul>
						{:else}
							<p>Données indisponibles</p>
						{/if}
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
