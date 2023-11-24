<script>
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    </script>
    
    <svelte:head>
        <title>SwingArt</title>
    </svelte:head>
    
    <Header />
    <h1>
        LAYOUT USER
    </h1>
        <main>
            <slot />
        </main>
    <Footer />