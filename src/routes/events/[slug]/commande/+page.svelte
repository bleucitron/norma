<script lang="ts">
	import Card from '../commande/component/card.svelte';
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
				placeholder="Enter your email"
				class="form-control"
				disabled
			/>
		</div>
		<div class="form-group">
			<input
				type="text"
				name="firstname"
				id="firstname"
				value=""
				required
				aria-required="true"
				placeholder="Ex : Marcel"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<input
				type="text"
				name="lastname"
				id="lastname"
				value=""
				required
				aria-required="true"
				placeholder="Ex : Duchamp"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<input
				type="text"
				name="adress"
				id="adress"
				value=""
				required
				aria-required="true"
				placeholder="Ex : 10 rue du lac"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<input
				type="text"
				name="cp"
				id="cp"
				value=""
				required
				aria-required="true"
				placeholder="Ex : 33000"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<input
				type="text"
				name="city"
				id="city"
				value=""
				required
				aria-required="true"
				placeholder="Ex : Bordeaux"
				class="form-control"
			/>
		</div>
		<div class="ticket-container">
			<p>Choisir le billet souhaité</p>
			<div class="ticket-card-wrapper">
				{#each data.event.tiers as price}
					<Card data={price} />
				{/each}
			</div>
		</div>

		<button type="submit">Aller au paiement</button>
	</form>
</section>

<style>
	.warning {
		color: red;
		margin-bottom: 1.6rem;
	}
</style>
