<script lang="ts">
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
		<button type="submit">Aller au paiement</button>
	</form>
</section>
