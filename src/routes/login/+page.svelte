<script lang="ts">
	import { enhance } from '$app/forms'
	export let form;
  import Textfield from '@smui/textfield';

</script>

<form class="login__form" method="post" use:enhance>
      <Textfield 
      variant="outlined"
      label="Email"
      name="email"
      value={form?.email ?? ''}
      autocomplete="off"
      >
      </Textfield>
        <Textfield 
        variant="outlined"
        label="Password"
        name="password"
        value={form?.password ?? ''}
        autocomplete="off"
        >
        </Textfield>
  <button>Login</button>
</form>
