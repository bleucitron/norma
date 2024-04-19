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

<section class="event__container event__details">
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
							<p>{event.description}</p>
						</div>

						<div class="wrapper__button">
							<a href="/admin" class="btn">Retour</a>
						</div>
					</div>
					<div class="event-chart">
						<div class="stat-wrapper">
							<h3>Statistiques globales</h3>
							<div class="stat">
								<p>
									<span>{event.totalTicket.length}</span>tickets vendus
								</p>
								<p>
									<span>{event.totalInscrit.length}</span> danseurs inscrits
								</p>
								<p>
									<span>{event.reglement.length} </span> tickets en cours de règlement
								</p>
								<p>
									<span>{event.attente.length}</span> inscrits en file d'attente
								</p>
							</div>
						</div>
						<div class="stat-wrapper">
							<h3>Types de tickets vendus</h3>
							<div class="stat">
								<ul>
									{#each event.typeOfTicketByEvent as ticket}
										<li>{ticket}</li>
									{/each}
								</ul>
							</div>
						</div>
						<div class="stat-wrapper">
							<div>
								<h3>Répartition des inscrits :</h3>
								<div class="wrapper__switch">
									<span>réels</span>
									<div id="switch" class="">
										<div id="toggle"></div>
									</div>
									<span>Estimé(e)s</span>
								</div>
							</div>
							<ul>
								<!-- Réel -->
								<li>
									<span>Débutant</span>
									<p>
										Leader : {event.Débutant.filter((dancer) => dancer.role === Role.Leader).length}
									</p>
									<p>
										Suiveur : {event.Débutant.filter((dancer) => dancer.role === Role.Suiveur)
											.length}
									</p>
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										<span>Débutant</span>
										<p>
											Leader : {event.Débutant.filter((dancer) => dancer.role === Role.Leader)
												.length +
												event.attente.filter(
													(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Leader
												).length}
										</p>
										<p>
											Suiveur : {event.Débutant.filter(
												(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Suiveur
											).length +
												event.attente.filter(
													(dancer) =>
														dancer.level === Level.Débutant && dancer.role === Role.Suiveur
												).length}
										</p>
									</li>
								{/if}
								<!-- Réel -->
								<li>
									<span>Confirmé</span>
									<p>
										Leader : {event.Confirmé.filter((dancer) => dancer.role === Role.Leader).length}
									</p>
									<p>
										Suiveur : {event.Confirmé.filter((dancer) => dancer.role === Role.Suiveur)
											.length}
									</p>
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										<span>Confirmé</span>
										<p>
											Leader : {event.Confirmé.filter((dancer) => dancer.role === Role.Leader)
												.length +
												event.attente.filter(
													(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Leader
												).length}
										</p>
										<p>
											Suiveur : {event.Confirmé.filter(
												(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
											).length +
												event.attente.filter(
													(dancer) =>
														dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
												).length}
										</p>
									</li>
								{/if}
								<!-- Réel -->
								<li>
									<span>Expert</span>
									<p>
										Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader).length}
									</p>
									<p>
										Suiveur : {event.Expert.filter((dancer) => dancer.role === Role.Suiveur).length}
									</p>
								</li>
								<!-- Prévision -->
								{#if isPronosticVisible}
									<li class="pronostic">
										<span>Expert</span>
										<p>
											Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader)
												.length +
												event.attente.filter(
													(dancer) => dancer.level === Level.Expert && dancer.role === Role.Leader
												).length}
										</p>
										<p>
											Suiveur : {event.Expert.filter(
												(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
											).length +
												event.attente.filter(
													(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
												).length}
										</p>
									</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
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
