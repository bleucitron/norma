<script lang="ts">
	import { Role, State, Level } from '$lib/types/norma.js';
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';

	export let data;
	$: event = data.event;
	$: orders = data.orders;
	let dancers = data.dancers;

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
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

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
								<p class="preview">
									Prévisions (inscrits + en attente de règlement) : <span id="circle"></span>
								</p>
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
								<li class="pronostic">
									<span>Débutant</span>
									<p>
										Leader : {event.Débutant.filter((dancer) => dancer.role === Role.Leader)
											.length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Leader
											).length}
									</p>
									<p>
										Suiveur : {event.Débutant.filter(
											(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Suiveur
										).length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Débutant && dancer.role === Role.Suiveur
											).length}
									</p>
								</li>
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
								<li class="pronostic">
									<span>Confirmé</span>
									<p>
										Leader : {event.Confirmé.filter((dancer) => dancer.role === Role.Leader)
											.length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Leader
											).length}
									</p>
									<p>
										Suiveur : {event.Confirmé.filter(
											(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
										).length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Confirmé && dancer.role === Role.Suiveur
											).length}
									</p>
								</li>
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
								<li class="pronostic">
									<span>Expert</span>
									<p>
										Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader).length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Expert && dancer.role === Role.Leader
											).length}
									</p>
									<p>
										Suiveur : {event.Expert.filter(
											(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
										).length +
											event.reglement.filter(
												(dancer) => dancer.level === Level.Expert && dancer.role === Role.Suiveur
											).length}
									</p>
								</li>
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
