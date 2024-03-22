<script>
	export let data;

	function handleClick() {
		const radioBtn = document.getElementById(data.id);
		if (radioBtn) {
			radioBtn.checked = true;
			const card = radioBtn.closest('.card-price');
			if (card) {
				const isActive = card.classList.contains('active');
				document.querySelectorAll('.card-price').forEach((card) => {
					card.classList.remove('active');
				});
				if (!isActive) {
					card.classList.add('active');
				}
			}
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleClick();
		}
	}
</script>

<button type="button" class="card-price" on:click={handleClick} on:keypress={handleKeyPress}>
	<input type="radio" id={data.id} name="tiers" value={JSON.stringify(data)} />
	<label for={data.id}>{data.label} : {(data.price / 100).toFixed(2).replace('.', ',')} €</label>
</button>
