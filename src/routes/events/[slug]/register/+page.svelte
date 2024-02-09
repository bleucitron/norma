<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	export let form;
	if (form?.error) {
		toast.push(form?.error, {
			theme: {
				'--toastBackground': '#cc210a',
				'--toastProgressBackground': '#d93c27',
				'--toastProgressAfterBackground': '#a5d6a7',
				'--toastColor': '#fff',
				'--toastProgressColor': '#fff',
				'--toastProgressAfterColor': '#fff'
			},
			duration: 1500
		});
	}
	let checked = false;
	function handleClick(event: any) {
		checked = !checked;
		setTimeout(() => (event.target.checked = checked), 0);
	}
</script>

<svelte:head>
	<title>Mes informations complémentaires</title>
</svelte:head>
<div id="login__page" class="form__tpl">
	<h1>Renseignez-nous !</h1>
	<form action="register" method="post">
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				value=""
				required
				aria-required="true"
				placeholder="Enter your email"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email de votre partenaire</label>
			<input
				type="email"
				name="partnaire_email"
				id="email"
				value=""
				placeholder="Email de votre partenaire"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="role-select">Votre rôle :</label>
			<select name="role" id="role-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value="0">Leader</option>
				<option value="1">Suiveur</option>
			</select>
		</div>
		<div class="form-group">
			<label for="level-select">Votre niveau :</label>
			<select name="level" id="level-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value="0">Débutant</option>
				<option value="1">Confirmé</option>
				<option value="2">Expert</option>
			</select>
		</div>
		<div class="form-group checkbox__container">
			<input
				type="checkbox"
				id="partner"
				name="partner"
				{checked}
				on:click|preventDefault={handleClick}
			/>
			<label for="partner">Je souhaite inscrire et payer pour mon partenaire</label>
		</div>
		{#if checked}
			<div class="form-group">
				<label for="role-select">Le rôle de votre partenaire :</label>
				<select name="partner_role" id="role-select" class="partner__info" required>
					<option value="">--Veuillez choisir une option--</option>
					<option value="0">Leader</option>
					<option value="1">Suiveur</option>
				</select>
			</div>
			<div class="form-group">
				<label for="level-select">Le niveau de votre partenaire :</label>
				<select name="partner_level" id="level-select" class="partner__info" required>
					<option value="">--Veuillez choisir une option--</option>
					<option value="0">Débutant</option>
					<option value="1">Confirmé</option>
					<option value="2">Expert</option>
				</select>
			</div>
		{/if}
		<button type="submit">Poursuivre l'inscription</button>
	</form>
</div>

<style lang="scss">
	.checkbox__container {
		display: flex;
		align-items: center;
		gap: 1rem;

		label {
			margin-bottom: 0;
		}
	}
</style>
