<script>
	export let data;
</script>

<div class="header-container">
	<h1>Les événements actuels</h1>
</div>

<ul class="events-list">
	{#each data.events as event}
		<li class="event">
			<a href="/events/{event.formSlug}" class="card">
				<div class="card__img">
					<div class="event__item">
						<div>
							{#if event.logo}<img
									src={event.logo.publicUrl}
									alt={event.title}
									class="event-img"
								/>{/if}
						</div>
						<div class="card__content">
							<h2>{event.title}</h2>
							<p>{event.description}</p>
							<div class="btn__container">
								<a href="/events/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
