<script lang="ts">
	import { State, Role, Level } from '$lib/types/norma';
	export let data;

	let todayDate = new Date();
	let archivedEvents: Array<any> = [];
	let events: any;
	let orders = data.orders;

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

	events.forEach((event) => {
		event.totalInscrit = data.dancers.filter(
			(dancer) => dancer.state === State.Inscrit && dancer.event === event.formSlug
		);
		event.reglement = data.dancers.filter(
			(dancer) => dancer.state === State['Règlement en cours'] && dancer.event === event.formSlug
		);
		event.attente = data.dancers.filter(
			(dancer) => dancer.state === State.Attente && dancer.event === event.formSlug
		);
		event.Débutant = event.totalInscrit.filter((dancer) => dancer.level === Level.Débutant);
		event.Confirmé = event.totalInscrit.filter((dancer) => dancer.level === Level.Confirmé);
		event.Expert = event.totalInscrit.filter((dancer) => dancer.level === Level.Expert);

		event.totalTicket = orders.filter((order) => order.order.formSlug === event.formSlug);

		event.typeOfTicketByEvent = event.totalTicket.map((order) => order.name);

		if (event.typeOfTicketByEvent.length === 0) {
			event.typeOfTicketByEvent.push('Aucun ticket vendu');
		}

		event.typeOfTicketByEvent = event.typeOfTicketByEvent.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
	});
</script>

<div class="header-container">
	<h1>Vos derniers événements</h1>
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

<ul class="events-list">
	{#each events as event}
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
						<h3>Stats</h3>
						<p>
							Nombre de ticket vendus pour l'évènement : {event.totalTicket.length};
						</p>
						<p>
							Nombre total de danseurs inscrits : {event.totalInscrit.length}
						</p>
						<p>
							Nombre total en cours de règement : {event.reglement.length}
						</p>
						<p>
							Nombre total en file d'attente : {event.attente.length}
						</p>
						<h4>Types de tickets vendus</h4>
						<ul>
							{#each event.typeOfTicketByEvent as ticket}
								<li>{ticket}</li>
							{/each}
						</ul>

						<h4>Niveau des inscrits :</h4>
						<ul>
							<li>
								Débutant : Leader : {event.Débutant.filter((dancer) => dancer.role === Role.Leader)
									.length}, Suiveur : {event.Débutant.filter(
									(dancer) => dancer.role === Role.Suiveur
								).length}
							</li>
							<li>
								Confirmé : Leader : {event.Confirmé.filter((dancer) => dancer.role === Role.Leader)
									.length}, Suiveur : {event.Confirmé.filter(
									(dancer) => dancer.role === Role.Suiveur
								).length}
							</li>
							<li>
								Expert : Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader)
									.length}, Suiveur : {event.Expert.filter((dancer) => dancer.role === Role.Suiveur)
									.length}
							</li>
						</ul>
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
