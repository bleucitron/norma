{#if typeof navigator !== 'undefined' && !navigator.onLine}
	<div class="network__container">
		<p>You are offline</p>
	</div>
{:else}
	<div class="network__container online">
		<p>You are online</p>
	</div>
{/if}

<style lang="scss">
	.network__container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: red;
		color: white;
		text-align: center;
		padding: 10px;
		z-index: 1000;

		&.online {
			background-color: green;
		}
	}
</style>
