<script lang="ts">
	export let data;
</script>

<div class="header-container">
	<h1>Validation de votre réservation</h1>
</div>

<section>
	<p class="warning">
		&#9888; Attention à renseigner le même email que celui avec lequel vous vous êtes inscrit à
		savoir : [EMAIL A METTRE ICI]
	</p>
	<iframe
		id="haWidget"
		scrolling="auto"
		src={data.url + '/widget'}
		style="width: 100%; height: 800px; border: none;"
		title={data.title}
	></iframe>
</section>

<style>
	.warning {
		color: red;
		margin-bottom: 1.6rem;
	}
</style>
