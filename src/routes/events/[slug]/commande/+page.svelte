<script lang="ts">
	import Card from '../commande/component/card.svelte';
	export let data;
	import { Circle } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores';
	const event = data.event;
</script>

{#if $navigating}
	<div class="loading">
		<Circle />
	</div>
{/if}

<section id="commande">
	<div class="header-container">
		<h1>Suite de votre réservation :</h1>
		<h2>(Veuillez choisir le billet souhaité)</h2>
	</div>

	<div class="infos">
		<div class="artwork">
			{#if event.logo && event.logo.publicUrl}
				<img src={event.logo.publicUrl} alt={`Logo de ${event.title}`} />
			{/if}
		</div>

		<div class="wrapper">
			<div class="location">
				<h3 class="title">
					<svg
						width="512"
						height="512"
						viewBox="0 0 512 512"
						style="color:currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-full w-full"
						><rect
							width="512"
							height="512"
							x="0"
							y="0"
							rx="30"
							fill="transparent"
							stroke="transparent"
							stroke-width="0"
							stroke-opacity="100%"
							paint-order="stroke"
						></rect><svg
							width="256px"
							height="256px"
							viewBox="0 0 48 48"
							fill="currentColor"
							x="128"
							y="128"
							role="img"
							style="display:inline-block;vertical-align:middle"
							xmlns="http://www.w3.org/2000/svg"
							><g fill="currentColor"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M37.962 14.925a3.455 3.455 0 0 1-4.887-4.887L28.538 5.5L5.5 28.538l4.538 4.538a3.455 3.455 0 0 1 4.887 4.886l4.537 4.538L42.5 19.462Zm-16.056-2.793L24 14.226m1.862 1.862l2.094 2.094m1.862 1.862l2.094 2.094M33.774 24l2.094 2.094"
								/></g
							></svg
						></svg
					>{event.title}
				</h3>
				<h4>{event.description}</h4>
				<p class="address">
					<svg
						width="512"
						height="512"
						viewBox="0 0 512 512"
						style="color:currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-full w-full"
						><rect
							width="512"
							height="512"
							x="0"
							y="0"
							rx="30"
							fill="transparent"
							stroke="transparent"
							stroke-width="0"
							stroke-opacity="100%"
							paint-order="stroke"
						></rect><svg
							width="256px"
							height="256px"
							viewBox="0 0 50 50"
							fill="currentColor"
							x="128"
							y="128"
							role="img"
							style="display:inline-block;vertical-align:middle"
							xmlns="http://www.w3.org/2000/svg"
							><g fill="currentColor"
								><path
									fill="currentColor"
									d="M25 0c-8.284 0-15 6.656-15 14.866c0 8.211 15 35.135 15 35.135s15-26.924 15-35.135C40 6.656 33.284 0 25 0zm-.049 19.312c-2.557 0-4.629-2.055-4.629-4.588c0-2.535 2.072-4.589 4.629-4.589c2.559 0 4.631 2.054 4.631 4.589c0 2.533-2.072 4.588-4.631 4.588z"
								/></g
							></svg
						></svg
					>{data.event.place.address}{data.event.place.city}, {data.event.place.zipCode}, {data
						.event.place.country}
				</p>
			</div>
			<div class="ticket-container">
				<div class="ticket-card-wrapper">
					{#each data.event.tiers as price}
						<Card data={{ price: price, info: data }} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
