<script lang="ts">
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div class="loading">
		<Circle color="#000000" />
	</div>
{/if}

<section class="template">
	<div class="hero container-error">
		<div class="hero__content">
			<div class="wrapper">
				<h1 class="header__logo">Liste d'attente</h1>
			</div>
			<p>
				Merci pour votre inscription ! Vous avez été ajouté(e) avec succès à notre liste d'attente.
				🎉 Dès qu'une place se libère, vous recevrez un email pour finaliser votre inscription.
				Restez à l'affût de votre boîte de réception ! 📧
			</p>
			<a href="/" class="btn discover__btn">Retour à la page d'accueil</a>
		</div>
	</div>
</section>
