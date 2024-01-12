<script>
	export let data;
	// console.log(data);

	function getEventRegisterRedirect() {
		if (data.user) {
			// a modifier quand on aura le systeme de connexion danceur
			return `/events/${data.formSlug}/dancer-info`;
		}
		return `/events/${data.formSlug}/login`;
	}
</script>

<section class="event__container">
	<div class="wrapper">
		<section class="card__img">
		<div class="card__img">
			<div>
				<div>
					{#if data.logo}
						<img src={data.logo.publicUrl} alt={`Logo de ${data.title}`} />
					{/if}
				</div>
				<div>
					<h1>{data.title}</h1>
					<p>Type de l'événement : {data.activityType}</p>
					<p>{data.description}</p>
					<h2>Prix :</h2>
					<ul>
						{#each data.tiers as price}
							<li>{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €</li>
						{/each}
					</ul>
					<iframe
						id="haWidget"
						allowtransparency="true"
						scrolling="auto"
						src={data.url + '/widget'}
						style="width: 100%; height: 750px; border: none;"
						title={data.title}
					></iframe>
				</div>
				<div class="btn__container">
					<a class="btn" href="{data.formSlug}/register">S'inscrire</a>
				</div>
			</div>
		</section>
				</div>
				<div class="btn__container">
					<a class="btn" href={getEventRegisterRedirect()}>S'inscrire</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		img {
			width: 100%;
		}
		iframe,
		h1,
		h2 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
