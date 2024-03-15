<script lang="ts">
	import Card from '../commande/component/card.svelte';
	export let data;
</script>

<div class="header-container">
	<h1>Suite de votre réservation</h1>
</div>

<section>
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
