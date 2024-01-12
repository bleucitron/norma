<script>
	export let data;
	// console.log(data);
</script>

<section class="event__container">
	<div class="wrapper">
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
		</div>
		<div class="btn__container">
			<a class="btn" href="{data.formSlug}/register">S'inscrire</a>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		img {
			width: 100%;
		}
		iframe,
		h1, h2 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
