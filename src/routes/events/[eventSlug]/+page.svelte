<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';
	export let data;
	console.log(data);
</script>

<section class="event__container">
	<Card>
		<Content>
			{#if data.logo}
				<img src={data.logo.publicUrl} alt={`Logo de ${data.title}`} />
			{/if}
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
		</Content>
		<!-- <Actions>
		<ActionButtons>
			<Button href="/user/register" variant="raised">S'inscrire</Button>
		</ActionButtons>
	</Actions> -->
	</Card>
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
