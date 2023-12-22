<script>
	export let data;
	console.log(data);
</script>

<section class="event__container">
	<div class="wrapper">
		<div class="card__img">
			{#if data.logo}
				<img src={data.logo.publicUrl} alt={`Logo de ${data.title}`} />
			{/if}
		</div>
		<div class="card__content">
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
		<div class="card__actions">
			<a href="/user/register" class="btn">S'inscrire</a>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		margin: 4rem 0;

		img {
			width: 100%;
		}
		iframe {
			margin: 2rem 0;
		}
	}
</style>
