<script lang="ts">
	import { Role, State, Level } from '$lib/types/norma.js';
	import { onMount } from 'svelte';

	export let data;
	$: event = data.event;
	$: orders = data.orders;
	let dancers = data.dancers;
	let isPronosticVisible = false;

	$: event.totalInscrit = dancers.filter(
		(dancer) => dancer.state === State.Inscrit && dancer.event === event.formSlug
	);

	$: event.reglement = dancers.filter(
		(dancer) => dancer.state === State['Règlement en cours'] && dancer.event === event.formSlug
	);

	$: event.attente = dancers.filter(
		(dancer) => dancer.state === State.Attente && dancer.event === event.formSlug
	);

	$: event.Débutant = event.totalInscrit.filter((dancer) => dancer.level === Level.Débutant);
	$: event.Confirmé = event.totalInscrit.filter((dancer) => dancer.level === Level.Confirmé);
	$: event.Expert = event.totalInscrit.filter((dancer) => dancer.level === Level.Expert);

	$: event.totalTicket = orders.filter((order) => order.order.formSlug === event.formSlug);

	$: event.typeOfTicketByEvent = event.totalTicket.map((order) => order.name);

	$: event.typeOfTicketByEvent = event.typeOfTicketByEvent.filter((value, index, self) => {
		return self.indexOf(value) === index;
	});

	onMount(() => {
		const toggleButton = document.getElementById('switch');
		toggleButton?.addEventListener('click', () => {
			toggleButton.classList.toggle('active');
			isPronosticVisible = !isPronosticVisible;
		});
	});
</script>

<section class="event__container">
	<div class="wrapper">
		<div class="card__img">
			<div>
				<div>
					{#if event.logo}
						<img src={event.logo.publicUrl} alt={`Logo de ${event.title}`} />
					{/if}
				</div>
				<div>
					<div class="wrapper__return">
						<div>
							<h1>{event.title}</h1>
						</div>
						<div class="wrapper__button">
							<div class="wrapper__switch">
								<p>réels</p>
								<div id="switch" class="">
									<div id="toggle"></div>
								</div>
								<p>Estimé(e)s</p>
							</div>
							<a href="/admin" class="btn">Retour</a>
						</div>
					</div>
					<div class="event-chart">
						<div class="stat-wrapper">
							<h3>Statistiques globales</h3>
							<p>
								Nombre de ticket vendus pour l'évènement : {event.totalTicket.length}
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
						</div>
						<div class="stat-wrapper">
							<h3>Types de tickets vendus</h3>
							<ul>
								{#each event.typeOfTicketByEvent as ticket}
									<li>{ticket}</li>
								{/each}
							</ul>
						</div>
						<div class="stat-wrapper">
							<h3>Répartition des inscrits :</h3>
							<ul>
								<!-- Réel -->
								<li>
									Débutant : Leader : {event.Débutant.filter(
										(dancer) => dancer.role === Role.Leader
									).length}, Suiveur : {event.Débutant.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										Débutant : Leader : {event.Débutant.filter(
											(dancer) => dancer.role === Role.Leader
										).length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Leader
											).length}, Suiveur : {event.Débutant.filter(
											(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Suiveur
										).length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Suiveur
											).length}
									</li>
								{/if}
								<!-- Réel -->
								<li>
									Confirmé : Leader : {event.Confirmé.filter(
										(dancer) => dancer.role === Role.Leader
									).length}, Suiveur : {event.Confirmé.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										Confirmé : Leader : {event.Confirmé.filter(
											(dancer) => dancer.role === Role.Leader
										).length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Leader
											).length}, Suiveur : {event.Confirmé.filter(
											(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
										).length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
											).length}
									</li>
								{/if}
								<!-- Réel -->
								<li>
									Expert : Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader)
										.length}, Suiveur : {event.Expert.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										Expert : Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader)
											.length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Expert && dancer.role === Role.Leader
											).length}, Suiveur : {event.Expert.filter(
											(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
										).length +
											event.attente.filter(
												(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
											).length}
									</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
				<p>Type de l'événement : {event.activityType}</p>
				<p>{event.description}</p>
				<div class="btn-container">
					<a
						href="https://admin.helloasso.com/{event.organizationSlug}/evenements/{event.formSlug}/edition/1"
						class="btn"
						target="_blank">Gérer</a
					>
					<a class="btn" href="/admin">Retour</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		.wrapper__button {
			display: flex;
			gap: 2rem;
		}

		img {
			width: 100%;
			height: 300px;
			object-fit: cover;
		}
		h1 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
