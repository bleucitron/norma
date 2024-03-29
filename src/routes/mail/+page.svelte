<script lang="ts">
	let userEmail = '';

	async function sendEmail(endpoint) {
		try {
			const response = await fetch(`/mail/${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({ email: userEmail })
			});

			if (response.ok) {
				const result = await response.text();
				alert(`Email sent successfully: ${result}`);
			} else {
				alert(`Failed to send email: ${await response.text()}`);
			}
		} catch (error) {
			alert(`Error: ${error}`);
		}
	}
</script>

<div class="email-form">
	<label for="email">Votre adresse email :</label>
	<input type="email" id="email" bind:value={userEmail} />

	<button on:click={() => sendEmail('paid')}>Envoyer Email (Payé)</button>
	<button on:click={() => sendEmail('register')}>Envoyer Email (Inscription)</button>
	<button on:click={() => sendEmail('waiting-list')}>Envoyer Email (Liste d'attente)</button>
</div>
