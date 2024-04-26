<script lang="ts">
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';

	export let data;
	let todayDate = new Date();
	let archivedEvents: Array<any> = [];
	let events;

	let eventBySlug = data;

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

	events.forEach((event: { formSlug: any; tiers: any; place: any }) => {
		const eventDetail = eventBySlug.eventsDetail.find(
			(detail) => detail.formSlug === event.formSlug
		);

		if (eventDetail) {
			event.tiers = eventDetail.tiers;
			event.place = eventDetail.place;
		}
	});
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

<div class="hero">
	<div class="hero__content">
		<div class="wrapper">
			<h1 class="header__logo">Norma</h1>
			<img src="/assets/norma-logo.png" alt="logo" />
		</div>
		<p>
			L’application NORMA simplifie l’inscription à vos événements de danse préférés. Explorez une
			multitude d’ateliers et de soirées, inscrivez-vous à nos évènements et connectez-vous avec une
			communauté passionnée. Plongez dans la magie de la danse dès aujourd’hui !
		</p>
		<a href="#events" class="btn discover__btn">Voir les évènements</a>
	</div>
</div>

<div class="header-container">
	<h1>Événements</h1>
</div>

<ul class="events-list" id="events">
	{#each events as event}
		<!-- Comportement étrange. Une redirection est réalisée automatiquement si je survole la carte lorsque je suis en offline et que les ressources sont chargées en utilisant le serviceworker. Le phénomène de redirection automatique est stoppé en utilisant "data-sveltekit-preload-data="false". On ne sait pas pourquoi le problème à lieu et comme résoudre ce problème. -->
		<li class="event" data-sveltekit-preload-data="false">
			<a href="/events/{event.formSlug}" class="card">
				<div class="card__img">
					<div class="event__item">
						<div class="wrapper__img">
							{#if event.logo}<img src={event.logo.publicUrl} alt={event.title} class="event-img" />
							{:else}
								<img src="/assets/img/event-placeholder.webp" alt={event.title} class="event-img" />
							{/if}
						</div>
						<div class="card__content">
							<h2>{event.title}</h2>
							<div class="infos">
								<p>
									<strong>Date :</strong>
									{#if event.startDate}
										{new Date(event.startDate).toLocaleDateString('fr-FR')}
									{:else}
										Date indisponible
									{/if}
								</p>
								<p>
									<strong>Lieu :</strong>
									{#if event.place}
										{event.place.city}
									{:else}
										Non disponible
									{/if}
								</p>
								{#if event.tiers.length > 0}
									<p>
										<strong>Prix :</strong> À partir de {(event.tiers[0].price / 100)
											.toFixed(2)
											.replace('.', ',')} €
									</p>
								{/if}
							</div>
							<p>{event.description}</p>
							<div class="btn-container">
								<a href="/events/{event.formSlug}" class="btn">Découvrir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>

<div class="separator"></div>

<div class="separator"></div>

<div class="header-container">
	<h2>Événements terminés</h2>
</div>

<ul class="events-list events-archived">
	{#each archivedEvents as event}
		<li class="event">
			<a href="/archive/{event.formSlug}" class="card">
				<div class="card__img">
					<div class="event__item">
						<div>
							{#if event.logo}
								<img src={event.logo.publicUrl} alt={event.title} class="event-img" />
							{:else}
								<img src="/assets/img/event-placeholder.webp" alt={event.title} class="event-img" />
							{/if}
						</div>
						<div class="card__content">
							<h2>{event.title}</h2>
							<p>{event.description}</p>
							<div class="btn-container">
								<a href="/archive/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
