<script lang="ts">
	import { Level, Role } from '$lib/types/norma';
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

	let userRole: Role;
	let userLevel: Level;

	const roleMapping = {
		[Role.Leader]: 'Leader',
		[Role.Suiveur]: 'Suiveur'
	};

	const partnerRoleMapping = {
		[Role.Leader]: Role.Suiveur,
		[Role.Suiveur]: Role.Leader
	};

	function levelName(levelKey: Level) {
		switch (levelKey) {
			case Level.Débutant:
				return 'Débutant';
			case Level.Confirmé:
				return 'Confirmé';
			case Level.Expert:
				return 'Expert';
			default:
				return '';
		}
	}

	$: partnerRole = partnerRoleMapping[userRole];
	$: partnerLevel = userLevel;

	$: console.log({ userRole, userLevel, partnerRole, partnerLevel });
</script>

<svelte:head>
	<title>Mes informations complémentaires</title>
</svelte:head>
<div id="login__page" class="form__tpl">
	<h1>Renseignez-nous !</h1>
	<form action="register" method="post">
		<div class="form-group">
			<label for="lastname">Nom</label>
			<input
				type="text"
				name="lastname"
				id="lastname"
				value=""
				required
				aria-required="true"
				placeholder="Votre nom"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="firstname">Prénom</label>
			<input
				type="text"
				name="firstname"
				id="firstname"
				value=""
				required
				aria-required="true"
				placeholder="Votre prénom"
				class="form-control"
			/>
		</div>
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
			<select bind:value={userRole} name="role" id="role-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value={Role.Leader}>Leader</option>
				<option value={Role.Suiveur}>Suiveur</option>
			</select>
		</div>
		<div class="form-group">
			<label for="level-select">Votre niveau :</label>
			<select bind:value={userLevel} name="level" id="level-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value={Level.Débutant}>Débutant</option>
				<option value={Level.Confirmé}>Confirmé</option>
				<option value={Level.Expert}>Expert</option>
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
				<label for="partner_lastname">Le nom de votre partenaire</label>
				<input
					type="text"
					name="partner_lastname"
					id="partner_lastname"
					value=""
					required
					aria-required="true"
					placeholder="Le nom de votre partenaire"
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="partner_firstname">Le prénom de votre partenaire</label>
				<input
					type="text"
					name="partner_firstname"
					id="partner_firstname"
					value=""
					required
					aria-required="true"
					placeholder="Le prénom de votre partenaire"
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="role-select">Le rôle de votre partenaire :</label>
				<input
					type="text"
					name="partner_role"
					id="role-select-partner"
					class="partner__info"
					disabled
					value={roleMapping[partnerRole] || ''}
				/>
			</div>
			<div class="form-group">
				<label for="level-select">Le niveau de votre partenaire :</label>

				<input
					type="text"
					name="partner_level"
					id="level-select-partner"
					class="partner__info"
					disabled
					value={levelName(partnerLevel)}
				/>
			</div>
		{/if}
		<div>
			<button class="btn" type="submit">Poursuivre l'inscription</button>
		</div>
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
