<script lang="ts">
	export let data;
</script>

<div class="header-container">
	<h1>Validation de votre réservation</h1>
</div>

<section>
	<p class="warning">
		&#9888; Attention à renseigner le même email que celui avec lequel vous vous êtes inscrit à
		savoir : {data.email}
	</p>
	<form action="commande" method="post">
		<div class="form-group">
			<input
				type="hidden"
				name="email"
				id="email"
				value={data.email}
				required
				aria-required="true"
				class="form-control"
			/>
		</div>
		<fieldset>
			<legend>Billet choisi :</legend>
			{#each data.event.tiers as price}
				<div>
					<input type="radio" id={price.id} name="tiers" value={JSON.stringify(price)} />
					<label for={price.id}
						>{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €</label
					>
				</div>
			{/each}
		</fieldset>

		<button type="submit">Aller au paiement</button>
	</form>
</section>

<style>
	.warning {
		color: red;
		margin-bottom: 1.6rem;
	}
</style>
