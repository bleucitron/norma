<main>
	<div class="container">
		<h1>Bienvenue sur NORMA</h1>
		<h2>Connexion</h2>
		<p>
			Lorem ipsum dolor sit amet consectetur. Cursus nisl et volutpat erat egestas ut nunc viverra.
			In adipiscing non proin amet volutpat malesuada iaculis. Praesent enim a egestas in enim
			tincidunt magna. Quam vel nunc ultrices sagittis sit pharetra.
		</p>

		<button class="HaAuthorizeButton">
			<img
				src="https://api.helloasso.com/v5/DocAssets/logo-ha.svg"
				alt="Logo HelloAsso"
				class="HaAuthorizeButtonLogo"
			/>
			<span class="HaAuthorizeButtonTitle">Connecter à HelloAsso</span>
		</button>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap');

	/* Styles globaux */
	body,
	html {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: 'Source Serif Pro', serif;
	}

	.container {
		position: relative;
		text-align: center;
		padding: 10px;
		margin-top: 50vh;
		transform: translateY(-50%);
	}

	.container::before {
		content: '';
		position: absolute;

		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		width: 150%;
		height: 170%;
		background-color: #666;
		clip-path: circle(50% at 50% 50%);
		z-index: -1;
	}

	.container::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		width: 160%;
		height: 150%;
		background-color: #ffffff;
		clip-path: circle(50% at 50% 50%);
		z-index: -1;
	}

	h1 {
		font-size: 36px;
		color: white;
		margin-bottom: 72px;
	}

	h2 {
		font-size: 42px;
	}

	body,
	h1,
	h2,
	p {
		text-align: center;
		padding: 10px;
		font-family: 'Source Serif Pro', serif;
	}

	p {
		margin-bottom: 2rem;
	}

	/* Styles du bouton HelloAsso */

	.HaAuthorizeButton {
		align-items: center;
		display: flex;
		justify-content: center;
		margin: 0 auto;
		background-color: #ffffff;
		border: 0.0625rem solid #49d38a;
		border-radius: 0.125rem;
		padding: 0;
	}

	.HaAuthorizeButton:disabled {
		background-color: #e9e9f0;
		border-color: transparent;
		cursor: not-allowed;
	}

	.HaAuthorizeButton:not(:disabled):focus {
		box-shadow: 0 0 0 0.25rem rgba(73, 211, 138, 0.25);
	}

	.HaAuthorizeButtonLogo {
		padding: 0 0.8rem;
		width: 2.25rem;
	}

	.HaAuthorizeButtonTitle {
		background-color: #49d38a;
		color: #ffffff;
		font-size: 1rem;
		font-weight: 700;
		padding: 0.78125rem 1.5rem;
	}

	.HaAuthorizeButton:disabled .HaAuthorizeButtonTitle {
		background-color: #e9e9f0;
		color: #9a9da8;
	}

	.HaAuthorizeButton:not(:disabled):hover .HaAuthorizeButtonTitle,
	.HaAuthorizeButton:not(:disabled):focus .HaAuthorizeButtonTitle {
		background-color: #30c677;
	}
</style>
