<script lang="ts">
	export let data;
</script>

<section class="template">
	<div class="hero container-error">
		<div class="hero__content">
			<div class="wrapper">
				<h1 class="header__logo">🎉 Vous etes inscrit 🎉</h1>
			</div>
			<p>
				Merci pour votre inscription à notre évènement <strong>{data.event.title}</strong>. 🎉
			</p>
			<a href="/" class="btn discover__btn">Retour à la page d'accueil</a>
		</div>
	</div>
</section>
