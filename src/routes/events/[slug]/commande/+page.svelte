<script>
	export let data;
</script>

<div class="header-container">
	<h1>Validation de votre réservation</h1>
</div>

<section>
	<iframe
		id="haWidget"
		allowtransparency="true"
		scrolling="auto"
		src={data.url + '/widget'}
		style="width: 100%; height: 800px; border: none;"
		title={data.title}
	></iframe>
</section>
