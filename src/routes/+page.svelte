<script lang="ts">
	import { onMount } from 'svelte';
	import emailjs from 'emailjs-com';
	export let data;
	let todayDate = new Date();
	let archivedEvents: Array<any> = [];
	let events: any;
	let userEmail = '';

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

	onMount(() => {
		emailjs.init('o-t5Q0DblgKR0F2GD');
	});

	async function sendEmail() {
		if (!userEmail) {
			alert('Veuillez entrer une adresse e-mail.');
			return;
		}

		const templateParams = {
			from_name: 'Your Name',
			email: userEmail,
			message: 'Ton message',
			reply: 'your-email@example.com'
		};

		try {
			const response = await emailjs.send('service_wkav6z9', 'template_2a0ie3r', templateParams);
			if (response.text === 'OK') {
				alert('Email envoyé avec succès!');
			} else {
				alert("La réponse de l'email n'est pas OK !" + response.text);
			}
		} catch (error) {
			alert("Erreur lors de l'envoi de l'email. Erreur: " + error.text);
		}
	}
</script>

<div class="header-container">
	<h1>Les événements actuels</h1>
</div>

<ul class="events-list">
	{#each events as event}
		<li class="event">
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
							<p>{event.description}</p>
							<div class="btn__container">
								<a href="/events/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>

<div class="separator"></div>

<div class="email-input-container">
	<input
		type="email"
		bind:value={userEmail}
		placeholder="Adresse e-mail du destinataire"
		class="email-input"
	/>
</div>

<button on:click={sendEmail} class="email-button">Envoyer un email</button>
<div class="header-container">
	<h2>Les événements terminés</h2>
</div>

<ul class="events-list events-archived">
	{#each archivedEvents as event}
		<li class="event">
			<a href="/archive/{event.formSlug}" class="card">
				<div class="card__img">
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
								<a href="/archive/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
