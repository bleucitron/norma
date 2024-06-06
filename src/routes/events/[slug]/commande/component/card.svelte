<script>
	export let data;
</script>

<div class="ticket">
	<form
		action="commande?email={encodeURIComponent(data.info.email)}&partner={data.info.payForPartner}"
		method="post"
	>
		<p>Ticket</p>
		<div class="form-group"></div>
		<input type="hidden" id={data.price.id} name="tiers" value={JSON.stringify(data.price)} />
		<p>
			{data.price.label} : {(data.price.price / 100).toFixed(2).replace('.', ',')} €{data.info
				.payForPartner
				? ' x2'
				: ''}
		</p>
		<button class="btn" type="submit">Réserver mon billet</button>
	</form>
</div>
