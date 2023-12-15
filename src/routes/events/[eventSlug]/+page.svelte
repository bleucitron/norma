<script>
	import Button from '@smui/button';
	import Card, { Content, Actions, ActionButtons } from '@smui/card';
	export let data;
	console.log(data);
</script>

<Card>
	<Content>
		<h1>{data.title}</h1>
		{#if data.logo}
			<img src={data.logo.publicUrl} alt={`Logo de ${data.title}`} />
		{/if}
		<p>Type de l'événement : {data.activityType}</p>
		<p>{data.description}</p>
		<h2>Prix :</h2>
		<ul>
			{#each data.tiers as price}
				<li>{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €</li>
			{/each}
		</ul>
	</Content>
	<Actions>
		<ActionButtons>
			<Button href="/user/register" variant="raised">S'inscrire</Button>
		</ActionButtons>
	</Actions>
</Card>
