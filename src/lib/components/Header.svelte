<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate, goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';

	export let user: any;

	const logout = async () => {
		await $page.data.supabase.auth.signOut();
		invalidate('supabase:auth');
		setTimeout(() => goto('/'), 0);
		toast.push('Déconnexion réussie', {
			theme: {
				'--toastBackground': '#4caf50',
				'--toastProgressBackground': '#81c784',
				'--toastProgressAfterBackground': '#a5d6a7',
				'--toastColor': '#fff',
				'--toastProgressColor': '#fff',
				'--toastProgressAfterColor': '#fff'
			},
			duration: 1500
		});
	};
</script>

<header>
	{#if user}
		<section class="admin__bar">
			<div class="container">
				<div class="admin__bar-left">
					<p>{user.email}</p>
				</div>
				<div class="admin__bar-right">
					<a class="admin__link" href="/">Site client</a>
					<a class="admin__link" href="/admin">Administration</a>
					<button class="admin__link" on:click={logout}>Déconnexion</button>
				</div>
			</div>
		</section>
	{/if}
	<div class="container header__container">
		<div class="header__info">
			<a href="/" class="header__logo">Norma<img src="/assets/norma-logo.png" alt="logo" /></a>
		</div>
		<div class="bottom__divider"></div>
	</div>
</header>

<style lang="scss">
	.bottom__divider {
		border-bottom: 1px solid rgba(0, 0, 0, 0.452);
		height: 1rem;
		width: 100%;
	}
	header {
		flex-direction: column;
	}
	.admin__bar {
		background-color: black;
		height: 4rem;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 0 5rem 0;
		@media screen and (max-width: 900px) {
			padding: 0 2rem 0;
		}
		.container {
			justify-content: flex-start;
		}

		p,
		a {
			color: #fff;
			font-size: 1.4rem;
			line-height: 1.96rem;
			padding: 0.5rem;
		}
		a {
			font-weight: bold;
			transition: 0.3s ease-in-out;
			@media screen and (max-width: 900px) {
				font-size: 1.2rem;
			}
			&:hover {
				opacity: 0.8;
			}
		}
	}
	.admin__bar-left,
	.admin__bar-right {
		display: flex;
		width: 100%;
	}

	.admin__bar-left {
		@media screen and (max-width: 900px) {
			display: none;
		}
	}

	.admin__bar-right {
		justify-content: flex-end;
		gap: 1rem;
		@media screen and (max-width: 900px) {
			justify-content: space-between;
		}

		button {
			background: none;
			color: #fff;
			border: none;
			font-weight: bold;
			cursor: pointer;
			min-width: unset;
			padding: 0;
			@media screen and (max-width: 900px) {
				font-size: 1.2rem;
			}

			&:hover {
				opacity: 0.8;
			}
		}
	}
	.admin__link {
		display: flex;
		align-items: center;
		padding: 0.5rem 1.6rem !important;
		@media screen and (max-width: 900px) {
			padding: 0.5rem 0rem !important;
		}
	}
	.header__info {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.header__container {
		padding: 1.5rem 5rem 0;
		display: flex;
		flex-direction: column;
	}
</style>
