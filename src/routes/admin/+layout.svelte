<script>
import Header from '../../components/Header.svelte';
import Footer from '../../components/Footer.svelte';
</script>


<svelte:head>
	<title>SwingArt</title>
</svelte:head>

<Header />
<h1>
	LAYOUT ADMIN
</h1>
	<main>
		<slot />
	</main>
<Footer />