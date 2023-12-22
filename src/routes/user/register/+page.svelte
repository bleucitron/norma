<!-- <script>
  let checked = false;

  let valueA = '';
    let valueB = '';
    let valueC = '';
    let valueD = '';
    let valueE = '';
    let valueF = '';
    let valueG = '';
    let valueH = '';
    let valueI = '';
    let clicked = 0;
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<main>
    <h1>Inscription à SwingArt</h1>
    <div class="form-group">
        <h2>Your name</h2>
    </div>
        <Textfield 
            variant="outlined" 
            bind:value={valueA}
            label="Firstname"
            class="form-input"
        >
          <HelperText slot="helper">Helper Text</HelperText>
        </Textfield>
        <Textfield 
            variant="outlined" 
            bind:value={valueB} 
            label="Lastname"
            class="form-input"
        >
        <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
    <div class="form-group">
        <h2>Details</h2>
    </div>
    <Textfield 
            variant="outlined" 
            bind:value={valueC} 
            label="Email"
            class="form-input"
        >
        <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
    <Textfield 
        variant="outlined" 
        bind:value={valueD} 
        label="Address"
        class="form-input"
        >
        <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
    <Textfield 
        variant="outlined" 
        bind:value={valueE} 
        label="Password"
        class="form-input"
        >
        <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
    <Textfield 
        variant="outlined" 
        bind:value={valueF} 
        label="Password confirmation"
        class="form-input"
        >
        <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
</main>

<style>
    main {
        padding: 1rem;
    }

    h1 {
        text-align: center;
        margin: 3rem auto;
        max-width: 240px;
    }

    :global(.form-input) {
        width: 100%;
        margin-bottom: 1rem;
        max-height: 50px;
    }

    :global(label) {
        max-height: 50px;
    }



    
</style> -->