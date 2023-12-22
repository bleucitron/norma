<script lang="ts">
	import { enhance } from '$app/forms'
	export let form
</script>

<div id="login">
  <h1>Connexion</h1>
  <form method="post" use:enhance>
    <input 
      name="email" 
      value={form?.email ?? ''} 
      placeholder="Email"
      type="email"
    />
    <input 
      type="password" 
      name="password" 
      placeholder="Password"
    />
    <button>Login</button>
  </form>
  <a href="/register">Créer un compte</a>
</div>